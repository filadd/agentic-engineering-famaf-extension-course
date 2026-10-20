import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { NotAuthor, OwnQuestion, QuestionNotFound, SessionNotFound } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";

export const Question = Schema.Struct({
  id: Ulid,
  sessionId: Ulid,
  body: Schema.String,
  votes: Schema.Int,
  myVote: Schema.Boolean,
  mine: Schema.Boolean,
});

export type Question = typeof Question.Type;

export const AdminQuestion = Schema.Struct({
  ...Question.fields,
  answered: Schema.Boolean,
});

export type AdminQuestion = typeof AdminQuestion.Type;

export class QuestionsGroup extends HttpApiGroup.make("questions")
  .add(
    HttpApiEndpoint.get("list", "/questions", {
      query: { sessionId: Ulid },
      success: Schema.Array(Question),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.post("ask", "/questions", {
      payload: Schema.Struct({
        sessionId: Ulid,
        body: Schema.String.check(Schema.isTrimmed(), Schema.isMinLength(1)),
      }),
      success: Question.pipe(HttpApiSchema.status(201)),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.patch("vote", "/questions/:id", {
      params: { id: Ulid },
      payload: Schema.Struct({ myVote: Schema.Boolean }),
      success: Question,
      error: [QuestionNotFound, OwnQuestion],
    }),
    HttpApiEndpoint.delete("delete", "/questions/:id", {
      params: { id: Ulid },
      success: HttpApiSchema.NoContent,
      error: [QuestionNotFound, NotAuthor],
    }),
  )
  .middleware(CurrentUserMiddleware) {}

export class AdminQuestionsGroup extends HttpApiGroup.make("adminQuestions")
  .add(
    HttpApiEndpoint.get("list", "/admin/questions", {
      query: { sessionId: Ulid },
      success: Schema.Array(AdminQuestion),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.patch("answer", "/admin/questions/:id", {
      params: { id: Ulid },
      payload: Schema.Struct({ answered: Schema.Boolean }),
      success: AdminQuestion,
      error: QuestionNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}
