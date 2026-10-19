import type { InvalidTransition, PollNotDraft, PollNotFound } from "@kurasu/contract/errors";
import type { AdminPoll, PollChange } from "@kurasu/contract/polls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export interface PollUpdate {
  readonly id: string;
  readonly change: PollChange;
}

export const useUpdatePoll = (
  options?: MutationOptions<AdminPoll, PollUpdate, PollNotFound | PollNotDraft | InvalidTransition>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) =>
      runApi((api) => api.adminPolls.update({ params: { id: input.id }, payload: input.change })),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.allPolls() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.allAdminPolls() }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
