import { OwnAccess, UserNotFound } from "@kurasu/contract/errors";
import { CurrentUser } from "@kurasu/contract/middleware";
import { Codes } from "@kurasu/core/access/codes";
import { newEnrollmentCode } from "@kurasu/core/access/new-code";
import { Users } from "@kurasu/core/access/users";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";

import { KurasuApi } from "@kurasu/contract/api";

// `webOrigin` is where the QR of the enrollment code points, as
// `/registro?codigo=<code>`. The teacher cannot take their own access away:
// there would be no other teacher to give it back.
export const AdminUsersHandlers = (webOrigin: string) => {
  const enrollmentCode = (code: string) => ({
    code,
    url: `${webOrigin}/registro?codigo=${encodeURIComponent(code)}`,
  });

  return HttpApiBuilder.group(KurasuApi, "adminUsers", (handlers) =>
    handlers
      .handle("list", () =>
        Effect.gen(function* () {
          const users = yield* Users;

          return yield* users.list({
            orderBy: [
              { field: "name", direction: "asc", nulls: "last" },
              { field: "email", direction: "asc" },
            ],
          });
        }),
      )
      .handle("add", ({ payload }) =>
        Effect.gen(function* () {
          const users = yield* Users;
          const crypto = yield* Crypto.Crypto;
          const id = yield* crypto.randomULID.pipe(Effect.orDie);

          return yield* users.create({ id, email: payload.email.toLowerCase() });
        }),
      )
      .handle("setAccess", ({ params, payload }) =>
        Effect.gen(function* () {
          const current = yield* CurrentUser;

          if (params.id === current.id && !payload.hasAccess) {
            return yield* new OwnAccess();
          }

          const users = yield* Users;
          const updated = yield* users.update(params.id, { hasAccess: payload.hasAccess });

          return yield* Effect.fromOption(updated).pipe(Effect.mapError(() => new UserNotFound()));
        }),
      )
      .handle("getEnrollmentCode", () =>
        Effect.gen(function* () {
          const codes = yield* Codes;

          return enrollmentCode(yield* codes.ensureEnrollment(yield* newEnrollmentCode));
        }),
      )
      .handle("regenerateEnrollmentCode", () =>
        Effect.gen(function* () {
          const codes = yield* Codes;

          return enrollmentCode(yield* codes.regenerateEnrollment(yield* newEnrollmentCode));
        }),
      ),
  );
};
