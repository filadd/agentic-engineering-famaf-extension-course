import type { QuestionNotFound } from "@kurasu/contract/errors";
import type { AdminQuestion } from "@kurasu/contract/questions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export interface AnswerInput {
  readonly id: string;
  readonly answered: boolean;
}

export const useAnswerQuestion = (
  options?: MutationOptions<AdminQuestion, AnswerInput, QuestionNotFound>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) =>
      runApi((api) =>
        api.adminQuestions.answer({
          params: { id: input.id },
          payload: { answered: input.answered },
        }),
      ),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.allQuestions() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.allAdminQuestions() }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
