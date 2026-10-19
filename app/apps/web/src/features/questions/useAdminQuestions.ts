import type { AdminQuestion } from "@kurasu/contract/questions";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminQuestions = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<AdminQuestion>, EndpointError<"adminQuestions", "list">>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminQuestions(sessionId),
    call: (api) => api.adminQuestions.list({ query: { sessionId } }),
    options,
  });
