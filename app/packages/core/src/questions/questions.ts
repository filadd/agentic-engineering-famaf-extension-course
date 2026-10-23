import {
  NotAuthor,
  OwnQuestion,
  QuestionNotFound,
  type SessionNotFound,
} from "@kurasu/contract/errors";
import type { AdminQuestion, Question } from "@kurasu/contract/questions";
import type { Ulid } from "@kurasu/contract/ulid";
import type { User } from "@kurasu/contract/user";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { Classroom } from "../classroom.ts";
import { SessionsStore } from "../sessions/sessions-store.ts";
import { existingSession, visibleSession } from "../sessions/visible-session.ts";
import { QuestionVotesStore } from "./question-votes-store.ts";
import { QuestionsStore, type StoredQuestion } from "./questions-store.ts";

const toQuestion = (question: StoredQuestion): Question => ({
  id: question.id,
  sessionId: question.sessionId,
  body: question.body,
  votes: question.votes,
  myVote: question.myVote,
  mine: question.mine,
});

const toAdminQuestion = (question: StoredQuestion): AdminQuestion => ({
  ...toQuestion(question),
  answered: question.answered,
});

// The questions of the sessions, never with their author. The student sees the
// open questions of enabled sessions, most voted first, votes at most once
// each and never their own, and deletes only their own. The teacher sees the
// answered ones too, at the end, and marks or reopens them.
export class Questions extends Context.Service<
  Questions,
  {
    readonly listForStudent: (
      viewer: User,
      sessionId: Ulid,
    ) => Effect.Effect<ReadonlyArray<Question>, SessionNotFound>;
    readonly ask: (
      viewer: User,
      sessionId: Ulid,
      body: string,
    ) => Effect.Effect<Question, SessionNotFound>;
    readonly vote: (
      viewer: User,
      id: Ulid,
      myVote: boolean,
    ) => Effect.Effect<Question, QuestionNotFound | OwnQuestion>;
    readonly remove: (viewer: User, id: Ulid) => Effect.Effect<void, QuestionNotFound | NotAuthor>;
    readonly listForTeacher: (
      viewer: User,
      sessionId: Ulid,
    ) => Effect.Effect<ReadonlyArray<AdminQuestion>, SessionNotFound>;
    readonly answer: (
      viewer: User,
      id: Ulid,
      answered: boolean,
    ) => Effect.Effect<AdminQuestion, QuestionNotFound>;
  }
>()("kurasu/Questions") {
  static readonly layer = Layer.effect(
    Questions,
    Effect.gen(function* () {
      const store = yield* QuestionsStore;
      const votes = yield* QuestionVotesStore;
      const sessions = yield* SessionsStore;
      const classroom = yield* Classroom;
      const crypto = yield* Crypto.Crypto;

      const findQuestion = (viewer: User, id: Ulid) =>
        Effect.flatMap(store.get(id, viewer.id), (question) =>
          Effect.fromOption(question).pipe(Effect.mapError(() => new QuestionNotFound())),
        );

      // An open question of an enabled session: what the student can act on.
      const findOpenQuestion = (viewer: User, id: Ulid) =>
        Effect.gen(function* () {
          const question = yield* findQuestion(viewer, id);

          if (question.answered) {
            return yield* new QuestionNotFound();
          }

          yield* visibleSession(sessions, question.sessionId).pipe(
            Effect.mapError(() => new QuestionNotFound()),
          );

          return question;
        });

      return Questions.of({
        listForStudent: Effect.fn("Questions.listForStudent")(function* (viewer, sessionId) {
          yield* visibleSession(sessions, sessionId);

          const questions = yield* store.list(sessionId, viewer.id);

          return questions.filter((question) => !question.answered).map(toQuestion);
        }),
        ask: Effect.fn("Questions.ask")(function* (viewer, sessionId, body) {
          yield* visibleSession(sessions, sessionId);

          const id = yield* crypto.randomULID.pipe(Effect.orDie);

          yield* store.create({ id, sessionId, authorId: viewer.id, body });
          yield* classroom.notify(sessionId, "questions");

          return toQuestion(yield* findQuestion(viewer, id).pipe(Effect.orDie));
        }),
        vote: Effect.fn("Questions.vote")(function* (viewer, id, myVote) {
          const question = yield* findOpenQuestion(viewer, id);

          if (question.mine) {
            return yield* new OwnQuestion();
          }

          if (myVote) {
            const voteId = yield* crypto.randomULID.pipe(Effect.orDie);

            yield* votes.upsert(
              { id: voteId, questionId: id, userId: viewer.id },
              { target: ["questionId", "userId"] },
            );
          } else {
            yield* votes.removeWhere({ questionId: id, userId: viewer.id });
          }

          yield* classroom.notify(question.sessionId, "questions");

          return toQuestion(yield* findQuestion(viewer, id));
        }),
        remove: Effect.fn("Questions.remove")(function* (viewer, id) {
          const question = yield* findOpenQuestion(viewer, id);

          if (!question.mine) {
            return yield* new NotAuthor();
          }

          yield* store.remove(id);

          return yield* classroom.notify(question.sessionId, "questions");
        }),
        listForTeacher: Effect.fn("Questions.listForTeacher")(function* (viewer, sessionId) {
          yield* existingSession(sessions, sessionId);

          const questions = yield* store.list(sessionId, viewer.id);

          return [
            ...questions.filter((question) => !question.answered),
            ...questions.filter((question) => question.answered),
          ].map(toAdminQuestion);
        }),
        answer: Effect.fn("Questions.answer")(function* (viewer, id, answered) {
          const question = yield* findQuestion(viewer, id);

          yield* store.update(id, { answered });
          yield* classroom.notify(question.sessionId, "questions");

          return toAdminQuestion({ ...question, answered });
        }),
      });
    }),
  );
}
