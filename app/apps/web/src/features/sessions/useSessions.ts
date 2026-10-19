import type { SessionSummary } from "@kurasu/contract/sessions";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useSessions = (
  options?: QueryOptions<ReadonlyArray<SessionSummary>, EndpointError<"sessions", "list">>,
) =>
  useApiQuery({
    queryKey: queryKeys.sessions(),
    call: (api) => api.sessions.list(),
    options,
  });
