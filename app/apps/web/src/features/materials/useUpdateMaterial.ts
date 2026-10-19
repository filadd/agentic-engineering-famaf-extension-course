import type { MaterialNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface MaterialUpdate {
  readonly id: string;
  readonly isSlides: boolean;
}

export const useUpdateMaterial = (
  options?: MutationOptions<Material, MaterialUpdate, MaterialNotFound>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminMaterials.update({
        params: { id: input.id },
        payload: { isSlides: input.isSlides },
      }),
    invalidates: [
      queryKeys.allMaterials(),
      queryKeys.allAdminMaterials(),
      queryKeys.sessions(),
      queryKeys.adminSessions(),
    ],
    options,
  });
