import type { SessionNotFound } from "@kurasu/contract/errors";
import type { AdminQuestion } from "@kurasu/contract/questions";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useAdminQuestions = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<AdminQuestion>, SessionNotFound>,
) =>
  useQuery({
    queryKey: queryKeys.adminQuestions(sessionId),
    queryFn: () => runApi((api) => api.adminQuestions.list({ query: { sessionId } })),
    ...options,
  });
