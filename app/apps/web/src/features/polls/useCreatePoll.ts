import type { SessionNotFound } from "@kurasu/contract/errors";
import type { AdminPoll, PollDraft } from "@kurasu/contract/polls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export const useCreatePoll = (options?: MutationOptions<AdminPoll, PollDraft, SessionNotFound>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.adminPolls.create({ payload: input })),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["polls"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "polls"] }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
