import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminMaterials = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<Material>, SessionNotFound>,
) =>
  useApiQuery({
    queryKey: queryKeys.adminMaterials(sessionId),
    call: (api) => api.adminMaterials.list({ query: { sessionId } }),
    options,
  });
