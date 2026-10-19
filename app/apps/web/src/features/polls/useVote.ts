import type { Poll, ResponseValue } from "@kurasu/contract/polls";
import { useQueryClient } from "@tanstack/react-query";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";
import { withVote } from "./with-vote.ts";

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
    optimistic: [
      optimisticPatch<ReadonlyArray<Poll>, VoteInput>({
        key: () => queryKeys.allPolls(),
        patch: (polls, input) =>
          polls.map((poll) => (poll.id === input.pollId ? withVote(poll, input.myResponse) : poll)),
      }),
    ],
    errorToast: (input) =>
      "words" in input.myResponse ? undefined : "No se pudo registrar tu voto.",
    onSuccess: (poll) =>
      queryClient.setQueriesData<ReadonlyArray<Poll>>({ queryKey: queryKeys.allPolls() }, (polls) =>
        polls?.map((each) => (each.id === poll.id ? poll : each)),
      ),
    onError: () => queryClient.invalidateQueries({ queryKey: queryKeys.allPolls() }),
    options,
  });
};
