import type { ProfileInput } from "@kurasu/contract/me";
import type { Me } from "@kurasu/contract/user";
import { useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useUpdateProfile = (options?: MutationOptions<Me, ProfileInput>) => {
  const queryClient = useQueryClient();

  return useApiMutation({
    call: (api, input) => api.me.update({ payload: input }),
    onSuccess: (me) => queryClient.setQueryData(queryKeys.me(), me),
    options,
  });
};
