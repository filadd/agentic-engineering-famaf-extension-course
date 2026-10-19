import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { InvalidLink, MailNotSent, NoAccess, NotRegistered } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Email, Me } from "./user.ts";

export class AuthGroup extends HttpApiGroup.make("auth").add(
  HttpApiEndpoint.post("requestLink", "/auth/link", {
    payload: Schema.Struct({
      email: Email,
      enrollmentCode: Schema.optionalKey(Schema.String),
    }),
    success: HttpApiSchema.NoContent,
    error: [NoAccess, NotRegistered, MailNotSent],
  }),
  HttpApiEndpoint.post("openSession", "/auth/session", {
    payload: Schema.Struct({ code: Schema.String }),
    success: Me,
    error: [InvalidLink, NoAccess],
  }),
  HttpApiEndpoint.post("logout", "/auth/logout", {
    success: HttpApiSchema.NoContent,
  }).middleware(CurrentUserMiddleware),
) {}
