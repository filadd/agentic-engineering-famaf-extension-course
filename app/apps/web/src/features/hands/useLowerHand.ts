import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useLowerHand = (
  options?: MutationOptions<void, string, EndpointError<"raisedHands", "lower">>,
) =>
  useApiMutation({
    call: (api, sessionId) => api.raisedHands.lower({ query: { sessionId } }),
    invalidates: [queryKeys.allRaisedHands()],
    options,
  });
