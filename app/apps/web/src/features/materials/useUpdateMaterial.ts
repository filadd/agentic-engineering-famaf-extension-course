import type { MaterialNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export interface MaterialUpdate {
  readonly id: string;
  readonly isSlides: boolean;
}

export const useUpdateMaterial = (
  options?: MutationOptions<Material, MaterialUpdate, MaterialNotFound>,
) => {
  const queryClient = useQueryClient();

  return useMutation({
    ...options,
    mutationFn: (input) =>
      runApi((api) =>
        api.adminMaterials.update({
          params: { id: input.id },
          payload: { isSlides: input.isSlides },
        }),
      ),
    onSuccess: async (data, input, result, context) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["materials"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "materials"] }),
        queryClient.invalidateQueries({ queryKey: ["sessions"] }),
        queryClient.invalidateQueries({ queryKey: ["admin", "sessions"] }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
