import { AdminQuestion } from "@kurasu/contract/questions";
import { Ulid } from "@kurasu/contract/ulid";
import { QuestionsStore, type StoredQuestion } from "@kurasu/core/questions/questions-store";
import { asc, desc, eq, sql } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { batch, Database, firstRow } from "./database.ts";
import { repositoryOf } from "./repository.ts";
import { questions, questionVotes } from "./schema.ts";

const decodeQuestion = Schema.decodeUnknownEffect(
  Schema.Struct({ ...AdminQuestion.fields, authorId: Ulid }),
);

const { votes: _votes, myVote: _myVote, mine: _mine, ...recordFields } = AdminQuestion.fields;

const decodeRecord = Schema.decodeUnknownEffect(Schema.Struct({ ...recordFields, authorId: Ulid }));

interface QuestionRow {
  readonly id: string;
  readonly sessionId: string;
  readonly authorId: string;
  readonly body: string;
  readonly answered: boolean;
  readonly votes: number;
  readonly myVote: number;
}

const toQuestion = (viewerId: string, row: QuestionRow): Effect.Effect<StoredQuestion> =>
  decodeQuestion({
    ...row,
    myVote: row.myVote === 1,
    mine: row.authorId === viewerId,
  }).pipe(Effect.orDie);

export const D1Questions = Layer.effect(
  QuestionsStore,
  Effect.gen(function* () {
    const { db, client } = yield* Database;

    const repository = yield* repositoryOf(questions, {
      decode: (row) => decodeRecord(row).pipe(Effect.orDie),
    });

    const votes = sql<number>`(select count(*) from ${questionVotes} where ${questionVotes.questionId} = ${questions.id})`;

    const select = (viewerId: string) =>
      db
        .select({
          id: questions.id,
          sessionId: questions.sessionId,
          authorId: questions.authorId,
          body: questions.body,
          answered: questions.answered,
          votes,
          myVote: sql<number>`exists (select 1 from ${questionVotes} where ${questionVotes.questionId} = ${questions.id} and ${questionVotes.userId} = ${viewerId})`,
        })
        .from(questions);

    return QuestionsStore.of({
      ...repository,
      list: (sessionId, viewerId) =>
        select(viewerId)
          .where(eq(questions.sessionId, sessionId))
          .orderBy(desc(votes), asc(questions.id))
          .pipe(Effect.orDie, Effect.flatMap(Effect.forEach((row) => toQuestion(viewerId, row)))),
      get: (id, viewerId) =>
        select(viewerId)
          .where(eq(questions.id, id))
          .limit(1)
          .pipe(
            Effect.orDie,
            Effect.flatMap(firstRow((row: QuestionRow) => toQuestion(viewerId, row))),
          ),
      remove: (id) =>
        batch(client, [
          db.delete(questionVotes).where(eq(questionVotes.questionId, id)),
          db.delete(questions).where(eq(questions.id, id)),
        ]),
    });
  }),
);
