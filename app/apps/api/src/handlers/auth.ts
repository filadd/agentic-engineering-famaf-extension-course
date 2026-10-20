import { CurrentUserMiddleware } from "@kurasu/contract/middleware";
import { Access } from "@kurasu/core/access/access";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";

import { KurasuApi } from "@kurasu/contract/api";
import { sessionMaxAgeSeconds } from "../session-tokens.ts";
import { toMe } from "./me-view.ts";

const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "lax",
  path: "/",
} as const;

export const AuthHandlers = HttpApiBuilder.group(KurasuApi, "auth", (handlers) =>
  handlers
    .handle("requestLink", ({ payload }) =>
      Effect.gen(function* () {
        const access = yield* Access;

        yield* access.requestLink(payload.email, payload.enrollmentCode);
      }),
    )
    .handle("openSession", ({ payload }) =>
      Effect.gen(function* () {
        const access = yield* Access;
        const opened = yield* access.openSession(payload.code);

        yield* HttpApiBuilder.securitySetCookie(
          CurrentUserMiddleware.security.session,
          opened.token,
          {
            ...cookieOptions,
            maxAge: `${sessionMaxAgeSeconds} seconds`,
          },
        );

        return toMe(opened.user);
      }),
    )
    .handle("logout", () =>
      HttpApiBuilder.securitySetCookie(CurrentUserMiddleware.security.session, "", {
        ...cookieOptions,
        maxAge: 0,
      }),
    ),
);
