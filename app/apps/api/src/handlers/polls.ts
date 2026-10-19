import { CurrentUser } from "@kurasu/contract/middleware";
import { Polls } from "@kurasu/core/polls/polls";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";

import { KurasuApi } from "@kurasu/contract/api";

export const PollsHandlers = HttpApiBuilder.group(KurasuApi, "polls", (handlers) =>
  handlers
    .handle("list", ({ query }) =>
      Effect.gen(function* () {
        const polls = yield* Polls;

        return yield* polls.listForStudent(yield* CurrentUser, query);
      }),
    )
    .handle("vote", ({ params, payload }) =>
      Effect.gen(function* () {
        const polls = yield* Polls;

        return yield* polls.vote(yield* CurrentUser, params.id, payload.myResponse);
      }),
    ),
);

export const AdminPollsHandlers = HttpApiBuilder.group(KurasuApi, "adminPolls", (handlers) =>
  handlers
    .handle("list", ({ query }) =>
      Effect.gen(function* () {
        const polls = yield* Polls;

        return yield* polls.listForTeacher(query.sessionId);
      }),
    )
    .handle("create", ({ payload }) =>
      Effect.gen(function* () {
        const polls = yield* Polls;

        return yield* polls.create(payload);
      }),
    )
    .handle("update", ({ params, payload }) =>
      Effect.gen(function* () {
        const polls = yield* Polls;

        return yield* polls.update(params.id, payload);
      }),
    )
    .handle("delete", ({ params }) =>
      Effect.gen(function* () {
        const polls = yield* Polls;

        yield* polls.remove(params.id);
      }),
    ),
);
