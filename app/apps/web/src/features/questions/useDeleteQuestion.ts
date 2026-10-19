import type { NotAuthor, QuestionNotFound } from "@kurasu/contract/errors";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useDeleteQuestion = (
  options?: MutationOptions<void, string, QuestionNotFound | NotAuthor>,
) =>
  useApiMutation({
    call: (api, id) => api.questions.delete({ params: { id } }),
    invalidates: [queryKeys.allQuestions()],
    options,
  });
