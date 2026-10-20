import type { AdminPoll } from "@kurasu/contract/polls";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminPolls = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<AdminPoll>, EndpointError<"adminPolls", "list">>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminPolls(sessionId),
    call: (api) => api.adminPolls.list({ query: { sessionId } }),
    options,
  });
