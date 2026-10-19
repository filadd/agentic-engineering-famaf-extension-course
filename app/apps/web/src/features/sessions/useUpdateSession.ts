import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Session, SessionChange } from "@kurasu/contract/sessions";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

export interface SessionUpdate {
  readonly id: string;
  readonly change: SessionChange;
}

export const useUpdateSession = (
  options?: MutationOptions<Session, SessionUpdate, SessionNotFound>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) =>
      runApi((api) =>
        api.adminSessions.update({ params: { id: input.id }, payload: input.change }),
      ),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminSessions() }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
