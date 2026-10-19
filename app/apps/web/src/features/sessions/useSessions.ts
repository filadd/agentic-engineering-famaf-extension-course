import type { SessionSummary } from "@kurasu/contract/sessions";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useSessions = (options?: QueryOptions<ReadonlyArray<SessionSummary>>) =>
  useQuery({
    queryKey: queryKeys.sessions(),
    queryFn: () => runApi((api) => api.sessions.list()),
    ...options,
  });
