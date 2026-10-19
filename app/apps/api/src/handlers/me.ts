import { NoAccess } from "@kurasu/contract/errors";
import { CurrentUser } from "@kurasu/contract/middleware";
import { Users } from "@kurasu/core/access/users";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";
import * as Option from "effect/Option";

import { ServedApi } from "../api.ts";
import { toMe } from "./me-view.ts";

export const MeHandlers = HttpApiBuilder.group(ServedApi, "me", (handlers) =>
  handlers
    .handle("get", () => Effect.map(CurrentUser, toMe))
    .handle("update", ({ payload }) =>
      Effect.gen(function* () {
        const current = yield* CurrentUser;
        const users = yield* Users;
        const updated = yield* users.updateProfile(current.id, payload);

        return toMe(
          yield* Option.match(updated, {
            onNone: () => Effect.die(new NoAccess()),
            onSome: Effect.succeed,
          }),
        );
      }),
    ),
);
