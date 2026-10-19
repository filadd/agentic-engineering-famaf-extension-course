import { SessionSummary } from "@kurasu/contract/sessions";
import { SessionsStore, type StoredSession } from "@kurasu/core/sessions/sessions-store";
import { and, asc, eq, isNull, sql } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";

import { batch, Database, now } from "./database.ts";
import { sessions } from "./schema.ts";

const StoredSessionSchema = Schema.Struct({
  ...SessionSummary.fields,
  enabled: Schema.Boolean,
  currentSlide: Schema.Int,
  currentStep: Schema.Int,
});

const decodeStored = Schema.decodeUnknownEffect(StoredSessionSchema);
const decodeSummary = Schema.decodeUnknownEffect(SessionSummary);

const toStored = (row: typeof sessions.$inferSelect): Effect.Effect<StoredSession> =>
  decodeStored({
    id: row.id,
    title: row.title,
    summary: row.summary,
    position: row.position,
    enabled: row.enabled,
    currentSlide: row.currentSlide,
    currentStep: row.currentStep,
  }).pipe(Effect.orDie);

const firstStored = (rows: ReadonlyArray<typeof sessions.$inferSelect>) => {
  const row = rows[0];

  return row == null ? Effect.succeedNone : Effect.asSome(toStored(row));
};

const notDeleted = isNull(sessions.deletedAt);

export const D1Sessions = Layer.effect(
  SessionsStore,
  Effect.gen(function* () {
    const { db, client } = yield* Database;

    // Positions are unique among the sessions not deleted, so `reorder` first
    // moves every session to a negative position and then to its new one.
    return SessionsStore.of({
      listEnabled: () =>
        db
          .select({
            id: sessions.id,
            title: sessions.title,
            summary: sessions.summary,
            position: sessions.position,
          })
          .from(sessions)
          .where(and(notDeleted, eq(sessions.enabled, true)))
          .orderBy(asc(sessions.position))
          .pipe(
            Effect.orDie,
            Effect.flatMap(Effect.forEach((row) => decodeSummary(row).pipe(Effect.orDie))),
          ),
      listAll: () =>
        db
          .select()
          .from(sessions)
          .where(notDeleted)
          .orderBy(asc(sessions.position))
          .pipe(Effect.orDie, Effect.flatMap(Effect.forEach(toStored))),
      get: (id) =>
        db
          .select()
          .from(sessions)
          .where(and(eq(sessions.id, id), notDeleted))
          .limit(1)
          .pipe(Effect.orDie, Effect.flatMap(firstStored)),
      create: (session) =>
        db
          .insert(sessions)
          .values({
            id: session.id,
            title: session.title,
            summary: session.summary,
            position: sql`(select coalesce(max(${sessions.position}), 0) + 1 from ${sessions} where ${sessions.deletedAt} is null)`,
          })
          .returning()
          .pipe(
            Effect.orDie,
            Effect.flatMap(firstStored),
            Effect.flatMap(
              Option.match({
                onNone: () => Effect.die("the new session was not stored"),
                onSome: Effect.succeed,
              }),
            ),
          ),
      update: (id, change) =>
        Object.keys(change).length === 0
          ? db
              .select()
              .from(sessions)
              .where(and(eq(sessions.id, id), notDeleted))
              .limit(1)
              .pipe(Effect.orDie, Effect.flatMap(firstStored))
          : db
              .update(sessions)
              .set(change)
              .where(and(eq(sessions.id, id), notDeleted))
              .returning()
              .pipe(Effect.orDie, Effect.flatMap(firstStored)),
      markDeleted: (id) =>
        db
          .update(sessions)
          .set({ deletedAt: now })
          .where(eq(sessions.id, id))
          .pipe(Effect.orDie, Effect.asVoid),
      reorder: (ids) =>
        batch(client, [
          ...ids.map((id, index) =>
            db
              .update(sessions)
              .set({ position: -(index + 1) })
              .where(eq(sessions.id, id)),
          ),
          ...ids.map((id, index) =>
            db
              .update(sessions)
              .set({ position: index + 1 })
              .where(eq(sessions.id, id)),
          ),
        ]),
    });
  }),
);
