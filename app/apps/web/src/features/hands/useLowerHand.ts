import type { SessionNotFound } from "@kurasu/contract/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export const useLowerHand = (options?: MutationOptions<void, string, SessionNotFound>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (sessionId) => runApi((api) => api.raisedHands.lower({ query: { sessionId } })),
    onSuccess: async (data, sessionId, result, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.allRaisedHands() });
      await options?.onSuccess?.(data, sessionId, result, context);
    },
  });
};
