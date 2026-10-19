import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Question } from "@kurasu/contract/questions";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useQuestions = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<Question>, SessionNotFound>,
) =>
  useApiQuery({
    queryKey: queryKeys.questions(sessionId),
    call: (api) => api.questions.list({ query: { sessionId } }),
    options,
  });
