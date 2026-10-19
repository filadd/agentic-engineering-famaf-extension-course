import type { OwnQuestion, QuestionNotFound } from "@kurasu/contract/errors";
import type { Question } from "@kurasu/contract/questions";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface QuestionVoteInput {
  readonly questionId: string;
  readonly myVote: boolean;
}

export const useVoteQuestion = (
  options?: MutationOptions<Question, QuestionVoteInput, QuestionNotFound | OwnQuestion>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.questions.vote({ params: { id: input.questionId }, payload: { myVote: input.myVote } }),
    invalidates: [queryKeys.allQuestions()],
    options,
  });
