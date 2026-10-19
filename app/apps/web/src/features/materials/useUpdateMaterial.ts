import type { MaterialNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";
import { queryKeys } from "../../api/query-keys.ts";

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
        queryClient.invalidateQueries({ queryKey: queryKeys.allMaterials() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.allAdminMaterials() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.sessions() }),
        queryClient.invalidateQueries({ queryKey: queryKeys.adminSessions() }),
      ]);
      await options?.onSuccess?.(data, input, result, context);
    },
  });
};
