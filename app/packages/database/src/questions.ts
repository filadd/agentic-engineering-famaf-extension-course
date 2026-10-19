import { AdminQuestion } from "@kurasu/contract/questions";
import { Ulid } from "@kurasu/contract/ulid";
import { QuestionsStore, type StoredQuestion } from "@kurasu/core/questions/questions-store";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { batch, Database } from "./database.ts";
import { questions, questionVotes } from "./schema.ts";

const decodeQuestion = Schema.decodeUnknownEffect(
  Schema.Struct({ ...AdminQuestion.fields, authorId: Ulid }),
);

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
    id: row.id,
    sessionId: row.sessionId,
    authorId: row.authorId,
    body: row.body,
    answered: row.answered,
    votes: row.votes,
    myVote: row.myVote === 1,
    mine: row.authorId === viewerId,
  }).pipe(Effect.orDie);

export const D1Questions = Layer.effect(
  QuestionsStore,
  Effect.gen(function* () {
    const { db, client } = yield* Database;

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
            Effect.flatMap((rows) => {
              const row = rows[0];

              return row == null ? Effect.succeedNone : Effect.asSome(toQuestion(viewerId, row));
            }),
          ),
      create: (question) => db.insert(questions).values(question).pipe(Effect.orDie, Effect.asVoid),
      setVote: (questionId, userId, vote) =>
        vote
          ? db
              .insert(questionVotes)
              .values({ questionId, userId })
              .onConflictDoNothing()
              .pipe(Effect.orDie, Effect.asVoid)
          : db
              .delete(questionVotes)
              .where(
                and(eq(questionVotes.questionId, questionId), eq(questionVotes.userId, userId)),
              )
              .pipe(Effect.orDie, Effect.asVoid),
      setAnswered: (id, answered) =>
        db
          .update(questions)
          .set({ answered })
          .where(eq(questions.id, id))
          .pipe(Effect.orDie, Effect.asVoid),
      remove: (id) =>
        batch(client, [
          db.delete(questionVotes).where(eq(questionVotes.questionId, id)),
          db.delete(questions).where(eq(questions.id, id)),
        ]),
    });
  }),
);
