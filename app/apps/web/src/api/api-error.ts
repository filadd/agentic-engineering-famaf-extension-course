import type { NoAccess, NotTeacher, Unauthenticated } from "@kurasu/contract/errors";
import type { HttpClientError } from "effect/http/HttpClientError";
import type { SchemaError } from "effect/Schema";
import type { UseMutationOptions, UseQueryOptions } from "@tanstack/react-query";

// What any call can fail with besides its own errors: the access middleware,
// the network and a response that does not decode.
export type ApiError<E = never> =
  | E
  | Unauthenticated
  | NoAccess
  | NotTeacher
  | HttpClientError
  | SchemaError;

export type QueryOptions<A, E = never> = Omit<
  UseQueryOptions<A, ApiError<E>>,
  "queryKey" | "queryFn"
>;

export type MutationOptions<A, I, E = never> = Omit<
  UseMutationOptions<A, ApiError<E>, I>,
  "mutationFn"
>;
