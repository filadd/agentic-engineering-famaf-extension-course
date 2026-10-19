import { CurrentUser } from "@kurasu/contract/middleware";
import { Questions } from "@kurasu/core/questions/questions";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";

import { ServedApi } from "../api.ts";

export const QuestionsHandlers = HttpApiBuilder.group(ServedApi, "questions", (handlers) =>
  handlers
    .handle("list", ({ query }) =>
      Effect.gen(function* () {
        const questions = yield* Questions;

        return yield* questions.listForStudent(yield* CurrentUser, query.sessionId);
      }),
    )
    .handle("ask", ({ payload }) =>
      Effect.gen(function* () {
        const questions = yield* Questions;

        return yield* questions.ask(yield* CurrentUser, payload.sessionId, payload.body);
      }),
    )
    .handle("vote", ({ params, payload }) =>
      Effect.gen(function* () {
        const questions = yield* Questions;

        return yield* questions.vote(yield* CurrentUser, params.id, payload.myVote);
      }),
    )
    .handle("delete", ({ params }) =>
      Effect.gen(function* () {
        const questions = yield* Questions;

        yield* questions.remove(yield* CurrentUser, params.id);
      }),
    ),
);

export const AdminQuestionsHandlers = HttpApiBuilder.group(
  ServedApi,
  "adminQuestions",
  (handlers) =>
    handlers
      .handle("list", ({ query }) =>
        Effect.gen(function* () {
          const questions = yield* Questions;

          return yield* questions.listForTeacher(yield* CurrentUser, query.sessionId);
        }),
      )
      .handle("answer", ({ params, payload }) =>
        Effect.gen(function* () {
          const questions = yield* Questions;

          return yield* questions.answer(yield* CurrentUser, params.id, payload.answered);
        }),
      ),
);
