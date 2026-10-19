import type { SessionNotFound } from "@kurasu/contract/errors";
import type { AdminPoll } from "@kurasu/contract/polls";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminPolls = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<AdminPoll>, SessionNotFound>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminPolls(sessionId),
    call: (api) => api.adminPolls.list({ query: { sessionId } }),
    options,
  });
