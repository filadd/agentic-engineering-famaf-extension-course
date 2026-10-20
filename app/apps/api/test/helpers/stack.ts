import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";

import Api from "../../src/worker.ts";

// The API Worker with its D1, R2, mail binding and classroom, without the web:
// what the API tests deploy, one local stage per test file.
export const ApiStack = Alchemy.Stack(
  "kurasu-api-test",
  { providers: Cloudflare.providers(), state: Alchemy.localState() },
  Effect.gen(function* () {
    const api = yield* Api;

    return { url: api.url.as<string>() };
  }),
);
