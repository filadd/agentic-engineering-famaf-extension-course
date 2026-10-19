import type { SessionNotFound } from "@kurasu/contract/errors";
import type { AdminPoll, PollDraft } from "@kurasu/contract/polls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export const useCreatePoll = (options?: MutationOptions<AdminPoll, PollDraft, SessionNotFound>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.adminPolls.create({ payload: input })),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.allPolls() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.allAdminPolls() }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
