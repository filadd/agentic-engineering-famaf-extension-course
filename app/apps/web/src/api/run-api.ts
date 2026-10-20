import { KurasuApi } from "@kurasu/contract/api";
import * as Effect from "effect/Effect";
import { FetchHttpClient } from "effect/http";
import { HttpApiClient } from "effect/http-api";

// The web and the API share an origin, and the API's paths already carry the
// /api prefix. The origin is read on each call because the SPA shell is
// rendered at build time, where there is no window.
const client = Effect.suspend(() =>
  HttpApiClient.make(KurasuApi, { baseUrl: globalThis.location.origin }),
).pipe(Effect.provide(FetchHttpClient.layer));

export type KurasuClient = Effect.Success<typeof client>;

export const runApi = <A, E>(call: (api: KurasuClient) => Effect.Effect<A, E>) =>
  Effect.runPromise(Effect.flatMap(client, call));
