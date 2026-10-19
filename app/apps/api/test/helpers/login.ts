import * as Effect from "effect/Effect";

import { request } from "./http.ts";

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
