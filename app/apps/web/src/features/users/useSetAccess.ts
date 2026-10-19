import type { OwnAccess, UserNotFound } from "@kurasu/contract/errors";
import type { User } from "@kurasu/contract/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export interface AccessChange {
  readonly id: string;
  readonly hasAccess: boolean;
}

export const useSetAccess = (
  options?: MutationOptions<User, AccessChange, UserNotFound | OwnAccess>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) =>
      runApi((api) =>
        api.adminUsers.setAccess({
          params: { id: input.id },
          payload: { hasAccess: input.hasAccess },
        }),
      ),
    onSuccess: async (data, input, result, context) => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.users() });
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
