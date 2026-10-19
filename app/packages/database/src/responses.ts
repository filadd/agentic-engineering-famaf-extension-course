import { ResponseValue } from "@kurasu/contract/polls";
import { ResponsesStore } from "@kurasu/core/polls/responses-store";
import { and, eq, inArray } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { Database } from "./database.ts";
import { responses } from "./schema.ts";

const decodeValue = Schema.decodeUnknownEffect(ResponseValue);

export const D1Responses = Layer.effect(
  ResponsesStore,
  Effect.gen(function* () {
    const { db } = yield* Database;

    return ResponsesStore.of({
      upsert: (pollId, userId, value) =>
        db
          .insert(responses)
          .values({ pollId, userId, value })
          .onConflictDoUpdate({ target: [responses.pollId, responses.userId], set: { value } })
          .pipe(Effect.orDie, Effect.asVoid),
      forUser: (userId, pollIds) =>
        pollIds.length === 0
          ? Effect.succeed(new Map())
          : db
              .select({ pollId: responses.pollId, value: responses.value })
              .from(responses)
              .where(and(eq(responses.userId, userId), inArray(responses.pollId, [...pollIds])))
              .pipe(
                Effect.orDie,
                Effect.flatMap(
                  Effect.forEach((row) =>
                    Effect.map(
                      decodeValue(row.value).pipe(Effect.orDie),
                      (value) => [row.pollId, value] as const,
                    ),
                  ),
                ),
                Effect.map((entries) => new Map(entries)),
              ),
      values: (pollIds) =>
        pollIds.length === 0
          ? Effect.succeed(new Map())
          : db
              .select({ pollId: responses.pollId, value: responses.value })
              .from(responses)
              .where(inArray(responses.pollId, [...pollIds]))
              .pipe(
                Effect.orDie,
                Effect.flatMap(
                  Effect.forEach((row) =>
                    Effect.map(decodeValue(row.value).pipe(Effect.orDie), (value) => ({
                      pollId: row.pollId,
                      value,
                    })),
                  ),
                ),
                Effect.map((rows) => {
                  const byPoll = new Map<string, Array<ResponseValue>>(
                    pollIds.map((id) => [id, []]),
                  );

                  for (const row of rows) {
                    byPoll.get(row.pollId)?.push(row.value);
                  }

                  return byPoll;
                }),
              ),
    });
  }),
);
