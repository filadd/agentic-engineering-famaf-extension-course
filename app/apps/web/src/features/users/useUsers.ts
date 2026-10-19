import type { User } from "@kurasu/contract/user";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useUsers = (options?: QueryOptions<ReadonlyArray<User>>) =>
  useQuery({
    queryKey: queryKeys.users(),
    queryFn: () => runApi((api) => api.adminUsers.list()),
    ...options,
  });
