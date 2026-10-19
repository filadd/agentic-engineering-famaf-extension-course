import type { PollNotFound } from "@kurasu/contract/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export const useDeletePoll = (options?: MutationOptions<void, string, PollNotFound>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.adminPolls.delete({ params: { id: input } })),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.allPolls() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.allAdminPolls() }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
