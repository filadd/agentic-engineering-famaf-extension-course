import type { RaisedHandSummary } from "@kurasu/contract/raised-hands";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useRaisedHands = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<RaisedHandSummary>, EndpointError<"raisedHands", "list">>,
) =>
  useApiQuery({
    queryKey: queryKeys.raisedHands(sessionId),
    call: (api) => api.raisedHands.list({ query: { sessionId } }),
    options,
  });
