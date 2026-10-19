import { CurrentUser } from "@kurasu/contract/middleware";
import { Hands } from "@kurasu/core/hands/hands";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";

import { ServedApi } from "../api.ts";

export const RaisedHandsHandlers = HttpApiBuilder.group(ServedApi, "raisedHands", (handlers) =>
  handlers
    .handle("list", ({ query }) =>
      Effect.gen(function* () {
        const hands = yield* Hands;

        return yield* hands.listForStudent(query.sessionId);
      }),
    )
    .handle("raise", ({ payload }) =>
      Effect.gen(function* () {
        const hands = yield* Hands;

        return yield* hands.raise(yield* CurrentUser, payload.sessionId);
      }),
    )
    .handle("lower", ({ query }) =>
      Effect.gen(function* () {
        const hands = yield* Hands;

        yield* hands.lowerOwn(yield* CurrentUser, query.sessionId);
      }),
    ),
);

export const AdminRaisedHandsHandlers = HttpApiBuilder.group(
  ServedApi,
  "adminRaisedHands",
  (handlers) =>
    handlers
      .handle("list", ({ query }) =>
        Effect.gen(function* () {
          const hands = yield* Hands;

          return yield* hands.listForTeacher(query.sessionId);
        }),
      )
      .handle("lower", ({ query }) =>
        Effect.gen(function* () {
          const hands = yield* Hands;

          yield* hands.lower(query.sessionId, query.userId);
        }),
      ),
);
