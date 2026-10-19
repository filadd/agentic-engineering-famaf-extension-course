import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useDeleteQuestion = (
  options?: MutationOptions<void, string, EndpointError<"questions", "delete">>,
) =>
  useApiMutation({
    call: (api, id) => api.questions.delete({ params: { id } }),
    invalidates: [queryKeys.allQuestions()],
    options,
  });
