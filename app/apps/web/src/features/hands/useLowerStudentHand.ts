import type { SessionNotFound } from "@kurasu/contract/errors";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export interface StudentHand {
  readonly sessionId: string;
  readonly userId: string;
}

export const useLowerStudentHand = (
  options?: MutationOptions<void, StudentHand, SessionNotFound>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.adminRaisedHands.lower({ query: input })),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["raised-hands"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "raised-hands"] }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
