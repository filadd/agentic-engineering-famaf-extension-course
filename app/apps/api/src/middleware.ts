import { NoAccess, NotTeacher, Unauthenticated } from "@kurasu/contract/errors";
import { CurrentUser, CurrentUserMiddleware } from "@kurasu/contract/middleware";
import { SessionTokens } from "@kurasu/core/access/session-tokens";
import { Users } from "@kurasu/core/access/users";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Redacted from "effect/Redacted";

// Checks the login and the access on every request: the cookie's token, then
// the user's has_access in D1, then the role on the admin groups.
export const CurrentUserMiddlewareLive = Layer.effect(
  CurrentUserMiddleware,
  Effect.gen(function* () {
    const tokens = yield* SessionTokens;
    const users = yield* Users;

    return CurrentUserMiddleware.of({
      session: Effect.fn("CurrentUserMiddleware")(function* (httpEffect, { credential, group }) {
        const token = Redacted.value(credential);

        if (token === "") {
          return yield* new Unauthenticated();
        }

        const userId = yield* tokens
          .verify(token)
          .pipe(Effect.mapError(() => new Unauthenticated()));

        const user = yield* users.get(userId);

        if (Option.isNone(user) || !user.value.hasAccess) {
          return yield* new NoAccess();
        }

        if (group.identifier.startsWith("admin") && user.value.role !== "teacher") {
          return yield* new NotTeacher();
        }

        return yield* Effect.provideService(httpEffect, CurrentUser, user.value);
      }),
    });
  }),
);
