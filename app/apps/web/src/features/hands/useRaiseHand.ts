import type { RaisedHand, RaisedHandSummary } from "@kurasu/contract/raised-hands";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";
import { useMe } from "../me/useMe.ts";

export const useRaiseHand = (
  options?: MutationOptions<RaisedHand, string, EndpointError<"raisedHands", "raise">>,
) => {
  const userId = useMe().data?.id;

  return useApiMutation({
    call: (api, sessionId) => api.raisedHands.raise({ payload: { sessionId } }),
    invalidates: [queryKeys.allRaisedHands()],
    optimistic: [
      optimisticPatch<ReadonlyArray<RaisedHandSummary>, string>({
        key: queryKeys.raisedHands,
        patch: (hands, sessionId) =>
          userId == null || hands.some((hand) => hand.userId === userId)
            ? hands
            : [...hands, { sessionId, userId }],
      }),
    ],
    errorToast: () => "No se pudo levantar la mano.",
    options,
  });
};
