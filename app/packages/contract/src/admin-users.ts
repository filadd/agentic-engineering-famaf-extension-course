import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { EmailTaken, OwnAccess, UserNotFound } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";
import { Email, EnrollmentCode, User } from "./user.ts";

export const maxUsers = 100;

export class AdminUsersGroup extends HttpApiGroup.make("adminUsers")
  .add(
    HttpApiEndpoint.get("list", "/admin/users", {
      success: Schema.Array(User).check(Schema.isMaxLength(maxUsers)),
    }),
    HttpApiEndpoint.post("add", "/admin/users", {
      payload: Schema.Struct({ email: Email }),
      success: User.pipe(HttpApiSchema.status(201)),
      error: EmailTaken,
    }),
    HttpApiEndpoint.patch("setAccess", "/admin/users/:id", {
      params: { id: Ulid },
      payload: Schema.Struct({ hasAccess: Schema.Boolean }),
      success: User,
      error: [UserNotFound, OwnAccess],
    }),
    HttpApiEndpoint.get("getEnrollmentCode", "/admin/enrollment-code", {
      success: EnrollmentCode,
    }),
    HttpApiEndpoint.post("regenerateEnrollmentCode", "/admin/enrollment-code", {
      success: EnrollmentCode,
    }),
  )
  .middleware(CurrentUserMiddleware) {}
