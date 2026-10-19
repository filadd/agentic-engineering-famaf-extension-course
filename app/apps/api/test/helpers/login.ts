import * as Effect from "effect/Effect";

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
