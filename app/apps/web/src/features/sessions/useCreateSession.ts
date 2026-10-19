import type { Session, SessionInput } from "@kurasu/contract/sessions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export const useCreateSession = (options?: MutationOptions<Session, SessionInput>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) => runApi((api) => api.adminSessions.create({ payload: input })),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
