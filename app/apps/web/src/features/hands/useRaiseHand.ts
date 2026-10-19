import type { NotStudent, SessionNotFound } from "@kurasu/contract/errors";
import type { RaisedHand } from "@kurasu/contract/raised-hands";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useRaiseHand = (
  options?: MutationOptions<RaisedHand, string, SessionNotFound | NotStudent>,
) =>
  useApiMutation({
    call: (api, sessionId) => api.raisedHands.raise({ payload: { sessionId } }),
    invalidates: [queryKeys.allRaisedHands()],
    options,
  });
