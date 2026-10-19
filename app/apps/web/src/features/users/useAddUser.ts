import type { EmailTaken } from "@kurasu/contract/errors";
import type { User } from "@kurasu/contract/user";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useAddUser = (options?: MutationOptions<User, string, EmailTaken>) =>
  useApiMutation({
    call: (api, input) => api.adminUsers.add({ payload: { email: input } }),
    invalidates: [queryKeys.users()],
    options,
  });
