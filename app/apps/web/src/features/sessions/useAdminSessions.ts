import type { SessionSummary } from "@kurasu/contract/sessions";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminSessions = (
  options?: QueryOptions<ReadonlyArray<SessionSummary>, EndpointError<"adminSessions", "list">>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminSessions(),
    call: (api) => api.adminSessions.list(),
    options,
  });
