import type { OwnQuestion, QuestionNotFound } from "@kurasu/contract/errors";
import type { Question } from "@kurasu/contract/questions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export interface QuestionVoteInput {
  readonly questionId: string;
  readonly myVote: boolean;
}

export const useVoteQuestion = (
  options?: MutationOptions<Question, QuestionVoteInput, QuestionNotFound | OwnQuestion>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) =>
      runApi((api) =>
        api.questions.vote({ params: { id: input.questionId }, payload: { myVote: input.myVote } }),
      ),
    onSuccess: async (question, input, result, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.allQuestions() });
      await options?.onSuccess?.(question, input, result, context);
    },
  });
};
