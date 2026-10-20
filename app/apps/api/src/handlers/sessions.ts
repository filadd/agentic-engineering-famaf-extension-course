import { Sessions } from "@kurasu/core/sessions/sessions";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";

import { KurasuApi } from "@kurasu/contract/api";

export const SessionsHandlers = HttpApiBuilder.group(KurasuApi, "sessions", (handlers) =>
  handlers
    .handle("list", () =>
      Effect.gen(function* () {
        const sessions = yield* Sessions;

        return yield* sessions.listVisible();
      }),
    )
    .handle("get", ({ params }) =>
      Effect.gen(function* () {
        const sessions = yield* Sessions;

        return yield* sessions.getVisible(params.id);
      }),
    ),
);

export const AdminSessionsHandlers = HttpApiBuilder.group(KurasuApi, "adminSessions", (handlers) =>
  handlers
    .handle("list", () =>
      Effect.gen(function* () {
        const sessions = yield* Sessions;

        return yield* sessions.listAll();
      }),
    )
    .handle("get", ({ params }) =>
      Effect.gen(function* () {
        const sessions = yield* Sessions;

        return yield* sessions.get(params.id);
      }),
    )
    .handle("create", ({ payload }) =>
      Effect.gen(function* () {
        const sessions = yield* Sessions;

        return yield* sessions.create(payload);
      }),
    )
    .handle("update", ({ params, payload }) =>
      Effect.gen(function* () {
        const sessions = yield* Sessions;

        return yield* sessions.update(params.id, payload);
      }),
    )
    .handle("delete", ({ params }) =>
      Effect.gen(function* () {
        const sessions = yield* Sessions;

        yield* sessions.remove(params.id);
      }),
    )
    .handle("reorder", ({ payload }) =>
      Effect.gen(function* () {
        const sessions = yield* Sessions;

        yield* sessions.reorder(payload.ids);
      }),
    ),
);
