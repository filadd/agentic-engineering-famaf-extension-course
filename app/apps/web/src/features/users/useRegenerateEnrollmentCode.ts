import type { EnrollmentCode } from "@kurasu/contract/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export const useRegenerateEnrollmentCode = (options?: MutationOptions<EnrollmentCode, void>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => runApi((api) => api.adminUsers.regenerateEnrollmentCode()),
    onSuccess: async (data, input, result, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.enrollmentCode() });
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
