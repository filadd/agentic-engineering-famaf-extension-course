import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export const useLogout = (
  options?: MutationOptions<void, void, EndpointError<"auth", "logout">>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: () => runApi((api) => api.auth.logout()),
    onSuccess: async (data, input, result, context) => {
      await options?.onSuccess?.(data, input, result, context);
      queryClient.clear();
    },
  });
};
