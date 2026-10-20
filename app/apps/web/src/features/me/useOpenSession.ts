import type { Me } from "@kurasu/contract/user";
import { useQueryClient } from "@tanstack/react-query";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useOpenSession = (
  options?: MutationOptions<Me, string, EndpointError<"auth", "openSession">>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation({
    call: (api, code) => api.auth.openSession({ payload: { code } }),
    onSuccess: (me) => queryClient.setQueryData(queryKeys.me(), me),
    options,
  });
};
