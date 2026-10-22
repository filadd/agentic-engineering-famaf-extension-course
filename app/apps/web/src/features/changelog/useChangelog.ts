import type { ChangelogEntry } from "@kurasu/contract/changelog";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useChangelog = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<ChangelogEntry>, EndpointError<"adminChangelog", "list">>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminChangelog(sessionId),
    call: (api) => api.adminChangelog.list({ query: { sessionId } }),
    options,
  });
