import type { Material } from "@kurasu/contract/materials";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useMaterials = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<Material>, EndpointError<"materials", "list">>,
) =>
  useApiQuery({
    queryKey: queryKeys.materials(sessionId),
    call: (api) => api.materials.list({ query: { sessionId } }),
    options,
  });
