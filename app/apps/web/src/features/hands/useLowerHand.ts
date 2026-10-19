import type { RaisedHandSummary } from "@kurasu/contract/raised-hands";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";
import { useMe } from "../me/useMe.ts";

export const useLowerHand = (
  options?: MutationOptions<void, string, EndpointError<"raisedHands", "lower">>,
) => {
  const userId = useMe().data?.id;

  return useApiMutation({
    call: (api, sessionId) => api.raisedHands.lower({ query: { sessionId } }),
    invalidates: [queryKeys.allRaisedHands()],
    optimistic: [
      optimisticPatch<ReadonlyArray<RaisedHandSummary>, string>({
        key: queryKeys.raisedHands,
        patch: (hands) => hands.filter((hand) => hand.userId !== userId),
      }),
    ],
    errorToast: () => "No se pudo bajar la mano.",
    options,
  });
};
