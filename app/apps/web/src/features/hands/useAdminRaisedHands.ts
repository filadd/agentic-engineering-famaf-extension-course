import type { SessionNotFound } from "@kurasu/contract/errors";
import type { RaisedHand } from "@kurasu/contract/raised-hands";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useAdminRaisedHands = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<RaisedHand>, SessionNotFound>,
) =>
  useQuery({
    queryKey: queryKeys.adminRaisedHands(sessionId),
    queryFn: () => runApi((api) => api.adminRaisedHands.list({ query: { sessionId } })),
    ...options,
  });
