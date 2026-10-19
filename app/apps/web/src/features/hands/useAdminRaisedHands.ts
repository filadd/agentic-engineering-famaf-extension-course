import type { SessionNotFound } from "@kurasu/contract/errors";
import type { RaisedHand } from "@kurasu/contract/raised-hands";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminRaisedHands = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<RaisedHand>, SessionNotFound>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminRaisedHands(sessionId),
    call: (api) => api.adminRaisedHands.list({ query: { sessionId } }),
    options,
  });
