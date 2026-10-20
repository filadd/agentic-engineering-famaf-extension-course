import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";
import type * as Effect from "effect/Effect";

import type { KurasuClient } from "./run-api.ts";

// What an endpoint of the contract can fail with, as the HttpApi client types
// it: the endpoint's own errors, its middleware's, the network and a response
// that does not decode.
export type EndpointError<
  G extends keyof KurasuClient,
  N extends keyof KurasuClient[G],
> = KurasuClient[G][N] extends (...args: never) => Effect.Effect<unknown, infer E> ? E : never;

export type QueryOptions<A, E> = Omit<UseQueryOptions<A, E>, "queryKey" | "queryFn">;

export type MutationOptions<A, I, E> = Omit<UseMutationOptions<A, E, I>, "mutationFn">;
