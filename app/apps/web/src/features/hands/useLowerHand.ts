import type { SessionNotFound } from "@kurasu/contract/errors";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useLowerHand = (options?: MutationOptions<void, string, SessionNotFound>) =>
  useApiMutation({
    call: (api, sessionId) => api.raisedHands.lower({ query: { sessionId } }),
    invalidates: [queryKeys.allRaisedHands()],
    options,
  });
