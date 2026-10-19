import type { OwnAccess, UserNotFound } from "@kurasu/contract/errors";
import type { User } from "@kurasu/contract/user";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface AccessChange {
  readonly id: string;
  readonly hasAccess: boolean;
}

export const useSetAccess = (
  options?: MutationOptions<User, AccessChange, UserNotFound | OwnAccess>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminUsers.setAccess({
        params: { id: input.id },
        payload: { hasAccess: input.hasAccess },
      }),
    invalidates: [queryKeys.users()],
    options,
  });
