import * as Context from "effect/Context";
import { HttpApiMiddleware, HttpApiSecurity } from "effect/http-api";

import { NoAccess, NotTeacher, Unauthenticated } from "./errors.ts";
import type { User } from "./user.ts";

export class CurrentUser extends Context.Service<CurrentUser, User>()("kurasu/CurrentUser") {}

// One middleware for every endpoint that needs a login. It answers NotTeacher
// on the groups whose identifier starts with `admin`, so the admin check
// travels with the group instead of a second middleware.
export class CurrentUserMiddleware extends HttpApiMiddleware.Service<
  CurrentUserMiddleware,
  { provides: CurrentUser }
>()("kurasu/CurrentUserMiddleware", {
  security: {
    session: HttpApiSecurity.apiKey({ key: "session", in: "cookie" }),
  },
  error: [Unauthenticated, NoAccess, NotTeacher],
}) {}
