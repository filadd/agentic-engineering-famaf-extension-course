import type { Me } from "@kurasu/contract/user";
import { queryOptions } from "@tanstack/react-query";

import type { ApiError } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

// Shared by useMe and the guard of _app, so both read the same cache entry.
export const meQuery = () =>
  queryOptions<Me, ApiError>({
    queryKey: queryKeys.me(),
    queryFn: () => runApi((api) => api.me.get()),
  });
