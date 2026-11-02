import type { Session } from "@kurasu/contract/sessions";
import type { Position } from "@kurasu/slides/messages";
import { useQueryClient } from "@tanstack/react-query";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface SlideMove {
  readonly id: string;
  readonly position: Position;
}

// A saved move cancels a refetch still on the way, because the refetch could
// carry an older position than the one just saved.
export const useMoveSlide = (
  options?: MutationOptions<Session, SlideMove, EndpointError<"adminSessions", "update">>,
) => {
  const queryClient = useQueryClient();

  return useApiMutation({
    call: (api, input) =>
      api.adminSessions.update({
        params: { id: input.id },
        payload: { currentSlide: input.position.slide, currentStep: input.position.step },
      }),
    errorToast: () => "No se pudo mover la slide.",
    onSuccess: async (session, input) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.adminSession(input.id),
        exact: true,
      });
      queryClient.setQueryData(queryKeys.adminSession(input.id), session);
    },
    onError: (_error, input) =>
      queryClient.invalidateQueries({ queryKey: queryKeys.adminSession(input.id), exact: true }),
    options,
  });
};
