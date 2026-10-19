import type { SessionNotFound } from "@kurasu/contract/errors";
import type { AdminPoll } from "@kurasu/contract/polls";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useAdminPolls = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<AdminPoll>, SessionNotFound>,
) =>
  useQuery({
    queryKey: queryKeys.adminPolls(sessionId),
    queryFn: () => runApi((api) => api.adminPolls.list({ query: { sessionId } })),
    ...options,
  });
