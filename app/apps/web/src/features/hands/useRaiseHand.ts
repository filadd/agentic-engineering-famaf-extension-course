import type { NotStudent, SessionNotFound } from "@kurasu/contract/errors";
import type { RaisedHand } from "@kurasu/contract/raised-hands";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export const useRaiseHand = (
  options?: MutationOptions<RaisedHand, string, SessionNotFound | NotStudent>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (sessionId) => runApi((api) => api.raisedHands.raise({ payload: { sessionId } })),
    onSuccess: async (hand, sessionId, result, context) => {
      await queryClient.invalidateQueries({ queryKey: ["raised-hands"] });
      await options?.onSuccess?.(hand, sessionId, result, context);
    },
  });
};
