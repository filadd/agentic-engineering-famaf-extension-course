import type { Question } from "@kurasu/contract/questions";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface AskInput {
  readonly sessionId: string;
  readonly body: string;
}

export const useAskQuestion = (
  options?: MutationOptions<Question, AskInput, EndpointError<"questions", "ask">>,
) =>
  useApiMutation({
    call: (api, input) => api.questions.ask({ payload: input }),
    invalidates: [queryKeys.allQuestions()],
    options,
  });
