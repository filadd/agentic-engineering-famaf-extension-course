import type { SessionNotFound } from "@kurasu/contract/errors";
import type { AdminQuestion } from "@kurasu/contract/questions";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminQuestions = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<AdminQuestion>, SessionNotFound>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminQuestions(sessionId),
    call: (api) => api.adminQuestions.list({ query: { sessionId } }),
    options,
  });
