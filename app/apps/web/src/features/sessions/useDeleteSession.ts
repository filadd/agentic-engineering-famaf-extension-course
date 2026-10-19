import type { SessionEnabled, SessionNotFound } from "@kurasu/contract/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export const useDeleteSession = (
  options?: MutationOptions<void, string, SessionNotFound | SessionEnabled>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.adminSessions.delete({ params: { id: input } })),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminSessions() }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
