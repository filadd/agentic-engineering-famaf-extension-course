import type { SessionNotFound } from "@kurasu/contract/errors";
import type { RaisedHandSummary } from "@kurasu/contract/raised-hands";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useRaisedHands = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<RaisedHandSummary>, SessionNotFound>,
) =>
  useQuery({
    queryKey: queryKeys.raisedHands(sessionId),
    queryFn: () => runApi((api) => api.raisedHands.list({ query: { sessionId } })),
    ...options,
  });
