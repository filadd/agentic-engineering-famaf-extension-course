import { ResponseValue } from "@kurasu/contract/polls";
import { Ulid } from "@kurasu/contract/ulid";
import { ResponsesStore, type ResponseCounts } from "@kurasu/core/polls/responses-store";
import { sql } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { Database } from "./database.ts";
import { repositoryOf } from "./repository.ts";
import { responses } from "./schema.ts";

const decodeResponse = Schema.decodeUnknownEffect(
  Schema.Struct({ id: Ulid, pollId: Ulid, userId: Ulid, value: ResponseValue }),
);

// A row of the counts: a choice or scale vote with how many sent it (`value`),
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

const maxWords = 100;

interface Mutable<C extends ResponseCounts> {
  count: number;
  values: Array<C["values"][number]>;
  words: Array<C["words"][number]>;
}

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
          case when json_type(${responses.value}, '$.words') is null then ${responses.value} end as value,
          null as word,
          count(*) as count
        from ${responses}
        where ${responses.pollId} in (select value from json_each(${pollIds}))
        group by 1, 2
        union all
        select pollId, null, word, count from (
          select ${responses.pollId} as pollId,
            words.value as word,
            count(distinct ${responses.userId}) as count,
            row_number() over (
              partition by ${responses.pollId}
              order by count(distinct ${responses.userId}) desc, words.value
            ) as rank
          from ${responses}, json_each(${responses.value}, '$.words') as words
          where ${responses.pollId} in (select value from json_each(${pollIds}))
          group by 1, 2
        )
        where rank <= ${maxWords}
      `);

    return ResponsesStore.of({
      list: repository.list,
      upsert: repository.upsert,
      counts: (pollIds) =>
        Effect.gen(function* () {
          if (pollIds.length === 0) {
            return new Map();
          }

          const rows = yield* countRows(JSON.stringify(pollIds)).pipe(
            Effect.orDie,
            Effect.flatMap(decodeCountRows),
            Effect.orDie,
          );

          const counts = new Map<string, Mutable<ResponseCounts>>();

          for (const row of rows) {
            const current = counts.get(row.pollId) ?? { count: 0, values: [], words: [] };

            if (row.word == null) {
              current.count += row.count;

              if (row.value != null) {
                current.values.push({ value: row.value, count: row.count });
              }
            } else {
              current.words.push({ word: row.word, count: row.count });
            }

            counts.set(row.pollId, current);
          }

          return counts;
        }),
    });
  }),
);
