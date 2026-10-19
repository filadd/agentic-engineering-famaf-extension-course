import type { User } from "@kurasu/contract/user";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useUsers = (options?: QueryOptions<ReadonlyArray<User>>) =>
  useApiQuery({
    queryKey: queryKeys.users(),
    call: (api) => api.adminUsers.list(),
    options,
  });
