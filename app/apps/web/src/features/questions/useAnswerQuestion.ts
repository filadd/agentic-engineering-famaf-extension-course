import type { QuestionNotFound } from "@kurasu/contract/errors";
import type { AdminQuestion } from "@kurasu/contract/questions";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface AnswerInput {
  readonly id: string;
  readonly answered: boolean;
}

export const useAnswerQuestion = (
  options?: MutationOptions<AdminQuestion, AnswerInput, QuestionNotFound>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminQuestions.answer({
        params: { id: input.id },
        payload: { answered: input.answered },
      }),
    invalidates: [queryKeys.allQuestions(), queryKeys.allAdminQuestions()],
    options,
  });
