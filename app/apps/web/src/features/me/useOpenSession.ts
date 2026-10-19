import type { InvalidLink, NoAccess } from "@kurasu/contract/errors";
import type { Me } from "@kurasu/contract/user";
import { useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useOpenSession = (options?: MutationOptions<Me, string, InvalidLink | NoAccess>) => {
  const queryClient = useQueryClient();

  return useApiMutation({
    call: (api, code) => api.auth.openSession({ payload: { code } }),
    onSuccess: (me) => queryClient.setQueryData(queryKeys.me(), me),
    options,
  });
};
