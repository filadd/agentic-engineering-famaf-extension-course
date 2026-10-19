import type { Me } from "@kurasu/contract/user";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useMe = (options?: QueryOptions<Me, EndpointError<"me", "get">>) =>
  useApiQuery({
    queryKey: queryKeys.me(),
    call: (api) => api.me.get(),
    options,
  });
