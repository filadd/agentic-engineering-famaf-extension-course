import type { InvalidLink, NoAccess } from "@kurasu/contract/errors";
import type { Me } from "@kurasu/contract/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useOpenSession = (options?: MutationOptions<Me, string, InvalidLink | NoAccess>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (code) => runApi((api) => api.auth.openSession({ payload: { code } })),
    onSuccess: async (me, code, result, context) => {
      queryClient.setQueryData(queryKeys.me(), me);
      await options?.onSuccess?.(me, code, result, context);
    },
  });
};
