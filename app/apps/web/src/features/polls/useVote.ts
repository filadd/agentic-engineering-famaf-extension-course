import type {
  InvalidResponse,
  NotStudent,
  PollNotActive,
  PollNotFound,
} from "@kurasu/contract/errors";
import type { Poll, ResponseValue } from "@kurasu/contract/polls";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export interface VoteInput {
  readonly pollId: string;
  readonly myResponse: ResponseValue;
}

export const useVote = (
  options?: MutationOptions<
    Poll,
    VoteInput,
    PollNotFound | PollNotActive | InvalidResponse | NotStudent
  >,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) =>
      runApi((api) =>
        api.polls.vote({ params: { id: input.pollId }, payload: { myResponse: input.myResponse } }),
      ),
    onSuccess: async (poll, input, result, context) => {
      queryClient.setQueriesData<ReadonlyArray<Poll>>({ queryKey: ["polls"] }, (polls) =>
        polls?.map((each) => (each.id === poll.id ? poll : each)),
      );
      await options?.onSuccess?.(poll, input, result, context);
    },
    onError: async (error, input, result, context) => {
      await queryClient.invalidateQueries({ queryKey: ["polls"] });
      await options?.onError?.(error, input, result, context);
    },
  });
};
