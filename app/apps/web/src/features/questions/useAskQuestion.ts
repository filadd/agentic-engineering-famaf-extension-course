import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Question } from "@kurasu/contract/questions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export interface AskInput {
  readonly sessionId: string;
  readonly body: string;
}

export const useAskQuestion = (options?: MutationOptions<Question, AskInput, SessionNotFound>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.questions.ask({ payload: input })),
    onSuccess: async (question, input, result, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.allQuestions() });
      await options?.onSuccess?.(question, input, result, context);
    },
  });
};
