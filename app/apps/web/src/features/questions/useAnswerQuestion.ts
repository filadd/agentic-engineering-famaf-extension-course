import type { AdminQuestion } from "@kurasu/contract/questions";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface AnswerInput {
  readonly id: string;
  readonly answered: boolean;
}

export const useAnswerQuestion = (
  options?: MutationOptions<AdminQuestion, AnswerInput, EndpointError<"adminQuestions", "answer">>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminQuestions.answer({
        params: { id: input.id },
        payload: { answered: input.answered },
      }),
    invalidates: [queryKeys.allQuestions(), queryKeys.allAdminQuestions()],
    optimistic: [
      optimisticPatch<ReadonlyArray<AdminQuestion>, AnswerInput>({
        key: () => queryKeys.allAdminQuestions(),
        patch: (questions, input) =>
          questions.map((question) =>
            question.id === input.id ? { ...question, answered: input.answered } : question,
          ),
      }),
    ],
    errorToast: () => "No se pudo marcar la pregunta.",
    options,
  });
