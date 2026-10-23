import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useDeleteMaterial = (
  options?: MutationOptions<void, string, EndpointError<"adminMaterials", "delete">>,
) =>
  useApiMutation({
    call: (api, input) => api.adminMaterials.delete({ params: { id: input } }),
    invalidates: [
      queryKeys.allMaterials(),
      queryKeys.allAdminMaterials(),
      queryKeys.sessions(),
      queryKeys.adminSessions(),
      queryKeys.allAdminChangelog(),
    ],
    options,
  });
