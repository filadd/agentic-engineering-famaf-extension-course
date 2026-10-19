import type { EmailTaken } from "@kurasu/contract/errors";
import type { User } from "@kurasu/contract/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export const useAddUser = (options?: MutationOptions<User, string, EmailTaken>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.adminUsers.add({ payload: { email: input } })),
    onSuccess: async (data, input, result, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users() });
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
