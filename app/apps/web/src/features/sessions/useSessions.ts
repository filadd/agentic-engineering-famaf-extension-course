import type { SessionSummary } from "@kurasu/contract/sessions";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useSessions = (options?: QueryOptions<ReadonlyArray<SessionSummary>>) =>
  useApiQuery({
    queryKey: queryKeys.sessions(),
    call: (api) => api.sessions.list(),
    options,
  });
