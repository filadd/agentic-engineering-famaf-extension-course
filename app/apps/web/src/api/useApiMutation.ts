import type { QueryKey, UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type * as Effect from "effect/Effect";

import type { MutationOptions } from "./api-error.ts";
import { runApi } from "./run-api.ts";
import type { KurasuClient } from "./run-api.ts";

type OwnCallbacks<A, I, E, C> = Pick<
  UseMutationOptions<A, E, I, C | undefined>,
  "onMutate" | "onSuccess" | "onError" | "onSettled"
>;

export interface ApiMutation<A, I, E, C> extends OwnCallbacks<A, I, E, C> {
  readonly call: (api: KurasuClient, input: I) => Effect.Effect<A, E>;
  readonly invalidates?: ReadonlyArray<QueryKey>;
  readonly options?: MutationOptions<A, I, E> | undefined;
}

// The hook's own callbacks run before the screen's, and its invalidation
// before the screen's onSuccess, so the screen always sees fresh data. The
// context the hook's onMutate returns is what its other callbacks receive. The
// error type comes from `call`, so it is the one the contract declares for the
// endpoint.
export const useApiMutation = <A, I, E, C = undefined>({
  call,
  invalidates = [],
  options,
  ...own
}: ApiMutation<A, I, E, C>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input: I) => runApi((api) => call(api, input)),
    onMutate: async (input, context) => {
      const result = await own.onMutate?.(input, context);

      await options?.onMutate?.(input, context);

      return result;
    },
    onSuccess: async (data, input, result, context) => {
      await own.onSuccess?.(data, input, result, context);
      await Promise.all(invalidates.map((queryKey) => queryClient.invalidateQueries({ queryKey })));
      await options?.onSuccess?.(data, input, result, context);
    },
    onError: async (error, input, result, context) => {
      await own.onError?.(error, input, result, context);
      await options?.onError?.(error, input, result, context);
    },
    onSettled: async (data, error, input, result, context) => {
      await own.onSettled?.(data, error, input, result, context);
      await options?.onSettled?.(data, error, input, result, context);
    },
  });
};
