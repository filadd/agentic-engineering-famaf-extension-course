import type { SessionNotFound } from "@kurasu/contract/errors";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface StudentHand {
  readonly sessionId: string;
  readonly userId: string;
}

export const useLowerStudentHand = (
  options?: MutationOptions<void, StudentHand, SessionNotFound>,
) =>
  useApiMutation({
    call: (api, input) => api.adminRaisedHands.lower({ query: input }),
    invalidates: [queryKeys.allRaisedHands(), queryKeys.allAdminRaisedHands()],
    options,
  });
