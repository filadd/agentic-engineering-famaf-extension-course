import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Session } from "@kurasu/contract/sessions";
import type { Position } from "@kurasu/slides/messages";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export interface SlideMove {
  readonly id: string;
  readonly position: Position;
}

// The teacher's slide moves before the API answers; a failed move puts the
// previous position back.
export const useMoveSlide = (options?: MutationOptions<Session, SlideMove, SessionNotFound>) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) =>
      runApi((api) =>
        api.adminSessions.update({
          params: { id: input.id },
          payload: { currentSlide: input.position.slide, currentStep: input.position.step },
        }),
      ),
    onMutate: async (input) => {
      const key = queryKeys.adminSession(input.id);

      await queryClient.cancelQueries({ queryKey: key });

      const previous = queryClient.getQueryData<Session>(key);

      queryClient.setQueryData<Session>(key, (session) =>
        session == null
          ? session
          : { ...session, currentSlide: input.position.slide, currentStep: input.position.step },
      );

      return { previous };
    },
    onError: async (error, input, result, context) => {
      queryClient.setQueryData(queryKeys.adminSession(input.id), result?.previous);
      await options?.onError?.(error, input, result, context);
    },
    onSuccess: async (session, input, result, context) => {
      queryClient.setQueryData(queryKeys.adminSession(input.id), session);
      await options?.onSuccess?.(session, input, result, context);
    },
  });
};
