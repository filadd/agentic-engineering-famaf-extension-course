import type { Poll, ResponseValue } from "@kurasu/contract/polls";
import { useQueryClient } from "@tanstack/react-query";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface VoteInput {
  readonly pollId: string;
  readonly myResponse: ResponseValue;
}

export const useVote = (
  options?: MutationOptions<Poll, VoteInput, EndpointError<"polls", "vote">>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation({
    call: (api, input) =>
      api.polls.vote({ params: { id: input.pollId }, payload: { myResponse: input.myResponse } }),
    onSuccess: (poll) =>
      queryClient.setQueriesData<ReadonlyArray<Poll>>({ queryKey: queryKeys.allPolls() }, (polls) =>
        polls?.map((each) => (each.id === poll.id ? poll : each)),
      ),
    onError: () => queryClient.invalidateQueries({ queryKey: queryKeys.allPolls() }),
    options,
  });
};
