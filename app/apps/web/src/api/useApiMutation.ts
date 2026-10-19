import type { QueryKey, UseMutationOptions } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type * as Effect from "effect/Effect";

import { showError } from "../ui/toast.ts";
import { isAccessError } from "./access-error.ts";
import type { MutationOptions } from "./api-error.ts";
import type { OptimisticPatch } from "./optimistic-patch.ts";
import { runApi } from "./run-api.ts";
import type { KurasuClient } from "./run-api.ts";

type Snapshot = ReadonlyArray<readonly [QueryKey, unknown]>;

type OwnCallbacks<A, I, E extends Error> = Pick<
  UseMutationOptions<A, E, I, Snapshot>,
  "onSuccess" | "onError" | "onSettled"
>;

export interface ApiMutation<A, I, E extends Error> extends OwnCallbacks<A, I, E> {
  readonly call: (api: KurasuClient, input: I) => Effect.Effect<A, E>;
  readonly invalidates?: ReadonlyArray<QueryKey>;
  readonly optimistic?: ReadonlyArray<OptimisticPatch<I>>;
  readonly errorToast?: (input: I) => string | undefined;
  readonly options?: MutationOptions<A, I, E> | undefined;
}

// The hook's own callbacks run before the screen's, and its invalidation
// before the screen's onSuccess, so the screen always sees fresh data. An
// optimistic mutation patches its keys before the request and puts back what
// they held if it fails; it invalidates after a failure too, so the screen ends
// up with what the server has. The error type comes from `call`, so it is the one
// the contract declares for the endpoint.
export const useApiMutation = <A, I, E extends Error>({
  call,
  invalidates = [],
  optimistic = [],
  errorToast,
  options,
  ...own
}: ApiMutation<A, I, E>) => {
  const queryClient = useQueryClient();

  const invalidate = () =>
    Promise.all(invalidates.map((queryKey) => queryClient.invalidateQueries({ queryKey })));

  return useMutation({
    ...options,
    mutationFn: (input: I) => runApi((api) => call(api, input)),
    onMutate: async (input, context): Promise<Snapshot> => {
      await Promise.all(
        optimistic.map((each) =>
          queryClient.cancelQueries({ queryKey: each.key(input), exact: each.exact }),
        ),
      );

      const snapshot = optimistic.flatMap((each) =>
        queryClient.getQueriesData({ queryKey: each.key(input), exact: each.exact }),
      );

      optimistic.forEach((each) => each.apply(queryClient, input));

      await options?.onMutate?.(input, context);

      return snapshot;
    },
    onSuccess: async (data, input, snapshot, context) => {
      await own.onSuccess?.(data, input, snapshot, context);
      await invalidate();
      await options?.onSuccess?.(data, input, snapshot, context);
    },
    onError: async (error, input, snapshot, context) => {
      snapshot?.forEach(([queryKey, data]) => queryClient.setQueryData(queryKey, data));

      const toast = errorToast?.(input);

      if (toast != null && !isAccessError(error)) {
        showError(toast);
      }

      await own.onError?.(error, input, snapshot, context);

      if (optimistic.length > 0) {
        await invalidate();
      }

      await options?.onError?.(error, input, snapshot, context);
    },
    onSettled: async (data, error, input, snapshot, context) => {
      await own.onSettled?.(data, error, input, snapshot, context);
      await options?.onSettled?.(data, error, input, snapshot, context);
    },
  });
};
