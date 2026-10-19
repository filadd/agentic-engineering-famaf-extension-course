import type { RaisedHand, RaisedHandSummary } from "@kurasu/contract/raised-hands";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface StudentHand {
  readonly sessionId: string;
  readonly userId: string;
}

export const useLowerStudentHand = (
  options?: MutationOptions<void, StudentHand, EndpointError<"adminRaisedHands", "lower">>,
) =>
  useApiMutation({
    call: (api, input) => api.adminRaisedHands.lower({ query: input }),
    invalidates: [queryKeys.allRaisedHands(), queryKeys.allAdminRaisedHands()],
    optimistic: [
      optimisticPatch<ReadonlyArray<RaisedHandSummary>, StudentHand>({
        key: (input) => queryKeys.raisedHands(input.sessionId),
        patch: (hands, input) => hands.filter((hand) => hand.userId !== input.userId),
      }),
      optimisticPatch<ReadonlyArray<RaisedHand>, StudentHand>({
        key: (input) => queryKeys.adminRaisedHands(input.sessionId),
        patch: (hands, input) => hands.filter((hand) => hand.user.id !== input.userId),
      }),
    ],
    errorToast: () => "No se pudo bajar la mano.",
    options,
  });
