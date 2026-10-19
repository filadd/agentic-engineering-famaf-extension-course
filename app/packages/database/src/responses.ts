import { ResponseValue } from "@kurasu/contract/polls";
import { ResponsesStore } from "@kurasu/core/polls/responses-store";
import { and, eq, inArray, type SQL } from "drizzle-orm";
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

    const rowsFor = (condition: SQL | undefined) =>
      db
        .select({ pollId: responses.pollId, value: responses.value })
        .from(responses)
        .where(condition)
        .pipe(
          Effect.orDie,
          Effect.flatMap(
            Effect.forEach((row) =>
              decodeValue(row.value).pipe(
                Effect.orDie,
                Effect.map((value) => ({ pollId: row.pollId, value })),
              ),
            ),
          ),
        );

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
          : rowsFor(
              and(eq(responses.userId, userId), inArray(responses.pollId, [...pollIds])),
            ).pipe(Effect.map((rows) => new Map(rows.map((row) => [row.pollId, row.value])))),
      values: (pollIds) =>
        pollIds.length === 0
          ? Effect.succeed(new Map())
          : rowsFor(inArray(responses.pollId, [...pollIds])).pipe(
              Effect.map((rows) => {
                const byPoll = new Map<string, Array<ResponseValue>>(pollIds.map((id) => [id, []]));

                for (const row of rows) {
                  byPoll.get(row.pollId)?.push(row.value);
                }

                return byPoll;
              }),
            ),
    });
  }),
);
