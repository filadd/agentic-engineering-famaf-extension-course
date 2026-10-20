import { SessionTokens } from "@kurasu/core/access/session-tokens";
import * as Effect from "effect/Effect";
import * as Redacted from "effect/Redacted";

import { JoseSessionTokens } from "../../src/session-tokens.ts";

import { testJwtSecret } from "./api-test.ts";
import { request } from "./http.ts";
import { linkCodeFor } from "./mail.ts";

// Logs in by opening a link code, as the web does with the link of the mail,
// and returns the session cookie to send on the next requests.
export const login = (url: string, code: string) =>
  Effect.gen(function* () {
    const response = yield* request(url, "POST", "/api/auth/session", { body: { code } });
    const cookie = response.headers["set-cookie"]?.split(";")[0];

    if (response.status !== 200 || cookie == null) {
      return yield* Effect.die(`opening the code ${code} answered ${response.status}`);
    }

    return cookie;
  });

// Logs in through the mail, as a user does: requests a link and opens the code
// it carries. A fixture code opens once, so a user who logs in from several
// tests of a file does it this way.
export const loginByMail = (url: string, email: string) =>
  Effect.gen(function* () {
    const requested = yield* request(url, "POST", "/api/auth/link", { body: { email } });

    if (requested.status !== 204) {
      return yield* Effect.die(`the link for ${email} answered ${requested.status}`);
    }

    return yield* login(url, yield* linkCodeFor(email));
  });

// A session cookie for `userId`, signed with the test stages' secret as the API
// signs its own. The login itself is tested through the link; the tests of
// the other endpoints log in this way to skip the mail.
export const cookieFor = (userId: string) =>
  Effect.gen(function* () {
    const tokens = yield* SessionTokens;

    return `session=${yield* tokens.sign(userId)}`;
  }).pipe(Effect.provide(JoseSessionTokens(Redacted.make(testJwtSecret))));
