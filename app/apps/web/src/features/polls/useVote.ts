import type { Poll, ResponseValue } from "@kurasu/contract/polls";
import { useQueryClient } from "@tanstack/react-query";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface VoteInput {
  readonly pollId: string;
  readonly myResponse: ResponseValue;
}

export type VoteOptions = MutationOptions<Poll, VoteInput, EndpointError<"polls", "vote">> & {
  readonly inlineError?: boolean;
};

export const useVote = ({ inlineError = false, ...options }: VoteOptions = {}) => {
  const queryClient = useQueryClient();

  return useApiMutation({
    call: (api, input) =>
      api.polls.vote({ params: { id: input.pollId }, payload: { myResponse: input.myResponse } }),
    errorToast: () => (inlineError ? undefined : "No se pudo registrar tu voto. Probá de nuevo."),
    onSuccess: (poll) =>
      queryClient.setQueriesData<ReadonlyArray<Poll>>({ queryKey: queryKeys.allPolls() }, (polls) =>
        polls?.map((each) => (each.id === poll.id ? poll : each)),
      ),
    onError: () => queryClient.invalidateQueries({ queryKey: queryKeys.allPolls() }),
    options,
  });
};
