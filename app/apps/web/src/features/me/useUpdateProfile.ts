import type { ProfileInput } from "@kurasu/contract/me";
import type { Me } from "@kurasu/contract/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useUpdateProfile = (options?: MutationOptions<Me, ProfileInput>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.me.update({ payload: input })),
    onSuccess: async (me, input, result, context) => {
      queryClient.setQueryData(queryKeys.me(), me);
      await options?.onSuccess?.(me, input, result, context);
    },
  });
};
