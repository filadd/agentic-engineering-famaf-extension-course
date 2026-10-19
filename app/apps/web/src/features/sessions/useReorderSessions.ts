import type { OrderMismatch } from "@kurasu/contract/errors";
import type { SessionSummary } from "@kurasu/contract/sessions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

// The list takes the new order as soon as the card is dropped; if the API
// rejects it, the list goes back to the server's order.
export const useReorderSessions = (
  options?: MutationOptions<void, ReadonlyArray<string>, OrderMismatch>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (ids) => runApi((api) => api.adminSessions.reorder({ payload: { ids } })),
    onMutate: async (ids) => {
      const key = queryKeys.adminSessions();

      await queryClient.cancelQueries({ queryKey: key, exact: true });

      const previous = queryClient.getQueryData<ReadonlyArray<SessionSummary>>(key);

      queryClient.setQueryData<ReadonlyArray<SessionSummary>>(key, (sessions) =>
        ids.flatMap((id, index) => {
          const session = sessions?.find((each) => each.id === id);

          return session == null ? [] : [{ ...session, position: index + 1 }];
        }),
      );

      return { previous };
    },
    onError: async (error, ids, result, context) => {
      queryClient.setQueryData(queryKeys.adminSessions(), result?.previous);
      await options?.onError?.(error, ids, result, context);
    },
    onSettled: async (data, error, ids, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.adminSessions(), exact: true }),
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions(), exact: true }),
      ]);
      await options?.onSettled?.(data, error, ids, result, context);
    },
  });
};
