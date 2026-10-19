import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Question } from "@kurasu/contract/questions";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useQuestions = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<Question>, SessionNotFound>,
) =>
  useQuery({
    queryKey: queryKeys.questions(sessionId),
    queryFn: () => runApi((api) => api.questions.list({ query: { sessionId } })),
    ...options,
  });
