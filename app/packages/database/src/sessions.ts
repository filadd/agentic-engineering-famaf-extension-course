import { SessionSummary } from "@kurasu/contract/sessions";
import { SessionsStore } from "@kurasu/core/sessions/sessions-store";
import { eq, sql } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { batch, Database } from "./database.ts";
import { repositoryOf } from "./repository.ts";
import { sessions } from "./schema.ts";

const StoredSessionSchema = Schema.Struct({
  ...SessionSummary.fields,
  enabled: Schema.Boolean,
  currentSlide: Schema.Int,
  currentStep: Schema.Int,
});

const decodeStored = Schema.decodeUnknownEffect(StoredSessionSchema);

export const D1Sessions = Layer.effect(
  SessionsStore,
  Effect.gen(function* () {
    const { db, client } = yield* Database;

    const repository = yield* repositoryOf(sessions, {
      decode: (row) => decodeStored(row).pipe(Effect.orDie),
      deletedAt: sessions.deletedAt,
    });

    // Positions are unique among the sessions not deleted, so `reorder` first
    // moves every session to a negative position and then to its new one.
    return SessionsStore.of({
      ...repository,
      listEnabled: () =>
        repository
          .list({ where: { enabled: true }, orderBy: { field: "position", direction: "asc" } })
          .pipe(
            Effect.map((enabled) =>
              enabled.map(({ id, title, summary, position }) => ({ id, title, summary, position })),
            ),
          ),
      create: (session) =>
        repository.create({
          ...session,
          position: sql`(select coalesce(max(${sessions.position}), 0) + 1 from ${sessions} where ${sessions.deletedAt} is null)`,
        }),
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
