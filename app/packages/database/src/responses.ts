import { FeedbackResponse, ResponseValue } from "@kurasu/contract/polls";
import { Ulid } from "@kurasu/contract/ulid";
import { ResponsesStore } from "@kurasu/core/polls/responses-store";
import { asc, eq, inArray, sql } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { Database } from "./database.ts";
import { repositoryOf } from "./repository.ts";
import { responses, users } from "./schema.ts";

const decodeResponse = Schema.decodeUnknownEffect(
  Schema.Struct({ id: Ulid, pollId: Ulid, userId: Ulid, value: ResponseValue }),
);

// A row of the counts: a choice, scale or feedback vote with how many sent it
// (`value`, a feedback vote as its pick alone),
// the votes of a words poll (neither), or a word with how many students sent it
// (`word`).
const decodeCountRows = Schema.decodeUnknownEffect(
  Schema.Array(
    Schema.Struct({
      pollId: Ulid,
      value: Schema.NullOr(Schema.fromJsonString(ResponseValue)),
      word: Schema.NullOr(Schema.String),
      count: Schema.Int,
    }),
  ),
);

const decodeFeedbackValue = Schema.decodeUnknownEffect(
  Schema.Struct({
    pick: Schema.Int,
    text: Schema.optionalKey(Schema.String),
  }),
);

const decodeFeedbackResponse = Schema.decodeUnknownEffect(FeedbackResponse);

export const D1Responses = Layer.effect(
  ResponsesStore,
  Effect.gen(function* () {
    const { db } = yield* Database;

    const repository = yield* repositoryOf(responses, {
      decode: (row) => decodeResponse(row).pipe(Effect.orDie),
    });

    // The poll ids go as one JSON array, so the query binds two parameters
    // however many polls it counts.
    const countRows = (pollIds: string) =>
      db.all(sql`
        select ${responses.pollId} as pollId,
          case
            when json_type(${responses.value}, '$.words') is not null then null
            when json_type(${responses.value}, '$.pick') is not null
              then json_object('pick', ${responses.value} ->> '$.pick')
            else ${responses.value}
          end as value,
          null as word,
          count(*) as count
        from ${responses}
        where ${responses.pollId} in (select value from json_each(${pollIds}))
        group by 1, 2
        union all
        select ${responses.pollId} as pollId,
          null,
          words.value as word,
          count(distinct ${responses.userId}) as count
        from ${responses}, json_each(${responses.value}, '$.words') as words
        where ${responses.pollId} in (select value from json_each(${pollIds}))
        group by 1, 3
      `);

    return ResponsesStore.of({
      list: repository.list,
      upsert: repository.upsert,
      feedbackOf: (pollIds) =>
        Effect.gen(function* () {
          if (pollIds.length === 0) {
            return new Map();
          }

          const rows = yield* db
            .select({
              id: responses.id,
              pollId: responses.pollId,
              userId: users.id,
              name: users.name,
              avatar: users.avatar,
              value: responses.value,
            })
            .from(responses)
            .innerJoin(users, eq(users.id, responses.userId))
            .where(inArray(responses.pollId, [...pollIds]))
            .orderBy(asc(responses.id))
            .pipe(Effect.orDie);

          const feedback = yield* Effect.forEach(rows, (row) =>
            Effect.gen(function* () {
              const { pick, text } = yield* decodeFeedbackValue(row.value);

              const fields = {
                id: row.id,
                user: { id: row.userId, name: row.name, avatar: row.avatar },
                pick,
              };

              return [
                row.pollId,
                yield* decodeFeedbackResponse(text == null ? fields : { ...fields, text }),
              ] as const;
            }).pipe(Effect.orDie),
          );

          return new Map(
            [...Map.groupBy(feedback, ([pollId]) => pollId)].map(([pollId, pairs]) => [
              pollId,
              pairs.map(([, response]) => response),
            ]),
          );
        }),
      counts: (pollIds) =>
        Effect.gen(function* () {
          if (pollIds.length === 0) {
            return new Map();
          }

          const rows = yield* countRows(JSON.stringify(pollIds)).pipe(
            Effect.flatMap(decodeCountRows),
            Effect.orDie,
          );

          return new Map(
            [...Map.groupBy(rows, (row) => row.pollId)].map(([pollId, pollRows]) => [
              pollId,
              {
                count: pollRows.reduce((sum, row) => (row.word == null ? sum + row.count : sum), 0),
                values: pollRows.flatMap(({ value, word, count }) =>
                  value == null || word != null ? [] : [{ value, count }],
                ),
                words: pollRows.flatMap(({ word, count }) =>
                  word == null ? [] : [{ word, count }],
                ),
              },
            ]),
          );
        }),
    });
  }),
);
