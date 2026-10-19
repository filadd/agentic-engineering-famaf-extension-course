import { AdminPoll } from "@kurasu/contract/polls";
import { PollsStore, type StoredPoll } from "@kurasu/core/polls/polls-store";
import { and, asc, eq, inArray, isNull } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { Database, now } from "./database.ts";
import { polls } from "./schema.ts";

const { results: _results, ...storedPollFields } = AdminPoll.fields;

const decodePoll = Schema.decodeUnknownEffect(Schema.Struct(storedPollFields));

const toPoll = (row: typeof polls.$inferSelect): Effect.Effect<StoredPoll> =>
  decodePoll({
    id: row.id,
    sessionId: row.sessionId,
    type: row.type,
    status: row.status,
    prompt: row.prompt,
    options: row.options ?? undefined,
    scaleMinLabel: row.scaleMinLabel ?? undefined,
    scaleMaxLabel: row.scaleMaxLabel ?? undefined,
  }).pipe(Effect.orDie);

const firstPoll = (rows: ReadonlyArray<typeof polls.$inferSelect>) => {
  const row = rows[0];

  return row == null ? Effect.succeedNone : Effect.asSome(toPoll(row));
};

const notDeleted = isNull(polls.deletedAt);

export const D1Polls = Layer.effect(
  PollsStore,
  Effect.gen(function* () {
    const { db } = yield* Database;

    const get = (id: string) =>
      db
        .select()
        .from(polls)
        .where(and(eq(polls.id, id), notDeleted))
        .limit(1)
        .pipe(Effect.orDie, Effect.flatMap(firstPoll));

    return PollsStore.of({
      list: (filter) =>
        filter.sessionIds.length === 0 || filter.statuses.length === 0
          ? Effect.succeed([])
          : db
              .select()
              .from(polls)
              .where(
                and(
                  notDeleted,
                  inArray(polls.sessionId, [...filter.sessionIds]),
                  inArray(polls.status, [...filter.statuses]),
                ),
              )
              .orderBy(asc(polls.id))
              .pipe(Effect.orDie, Effect.flatMap(Effect.forEach(toPoll))),
      get,
      create: (poll) =>
        db
          .insert(polls)
          .values({
            id: poll.id,
            sessionId: poll.sessionId,
            type: poll.type,
            status: poll.status,
            prompt: poll.prompt,
            options: poll.options ?? null,
            scaleMinLabel: poll.scaleMinLabel ?? null,
            scaleMaxLabel: poll.scaleMaxLabel ?? null,
          })
          .pipe(Effect.orDie, Effect.as(poll)),
      update: (id, change) =>
        Object.keys(change).length === 0
          ? get(id)
          : db
              .update(polls)
              .set(change)
              .where(and(eq(polls.id, id), notDeleted))
              .returning()
              .pipe(Effect.orDie, Effect.flatMap(firstPoll)),
      markDeleted: (id) =>
        db
          .update(polls)
          .set({ deletedAt: now })
          .where(eq(polls.id, id))
          .pipe(Effect.orDie, Effect.asVoid),
    });
  }),
);
