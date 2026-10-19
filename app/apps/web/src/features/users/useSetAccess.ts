import type { User } from "@kurasu/contract/user";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface AccessChange {
  readonly id: string;
  readonly hasAccess: boolean;
}

// Giving access is immediate; taking it away waits for the API in its
// confirmation.
export const useSetAccess = (
  options?: MutationOptions<User, AccessChange, EndpointError<"adminUsers", "setAccess">>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminUsers.setAccess({
        params: { id: input.id },
        payload: { hasAccess: input.hasAccess },
      }),
    invalidates: [queryKeys.users()],
    optimistic: [
      optimisticPatch<ReadonlyArray<User>, AccessChange>({
        key: () => queryKeys.users(),
        patch: (users, input) =>
          input.hasAccess
            ? users.map((user) => (user.id === input.id ? { ...user, hasAccess: true } : user))
            : users,
      }),
    ],
    errorToast: (input) => (input.hasAccess ? "No se pudo dar acceso." : undefined),
    options,
  });
