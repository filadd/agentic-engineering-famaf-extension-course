import type { RaisedHand } from "@kurasu/contract/raised-hands";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminRaisedHands = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<RaisedHand>, EndpointError<"adminRaisedHands", "list">>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminRaisedHands(sessionId),
    call: (api) => api.adminRaisedHands.list({ query: { sessionId } }),
    options,
  });
