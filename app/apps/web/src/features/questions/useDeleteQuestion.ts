import type { NotAuthor, QuestionNotFound } from "@kurasu/contract/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export const useDeleteQuestion = (
  options?: MutationOptions<void, string, QuestionNotFound | NotAuthor>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (id) => runApi((api) => api.questions.delete({ params: { id } })),
    onSuccess: async (data, id, result, context) => {
      await queryClient.invalidateQueries({ queryKey: ["questions"] });
      await options?.onSuccess?.(data, id, result, context);
    },
  });
};
