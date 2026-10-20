import type { Session } from "@kurasu/contract/sessions";
import type { Position } from "@kurasu/slides/messages";
import { useQueryClient } from "@tanstack/react-query";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface SlideMove {
  readonly id: string;
  readonly position: Position;
}

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
    optimistic: [
      optimisticPatch<Session, SlideMove>({
        key: (input) => queryKeys.adminSession(input.id),
        patch: (session, input) => ({
          ...session,
          currentSlide: input.position.slide,
          currentStep: input.position.step,
        }),
      }),
    ],
    errorToast: () => "No se pudo mover la slide.",
    onSuccess: (session, input) =>
      queryClient.setQueryData(queryKeys.adminSession(input.id), session),
    options,
  });
};
