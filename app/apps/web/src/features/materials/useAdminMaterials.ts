import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useAdminMaterials = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<Material>, SessionNotFound>,
) =>
  useQuery({
    queryKey: queryKeys.adminMaterials(sessionId),
    queryFn: () => runApi((api) => api.adminMaterials.list({ query: { sessionId } })),
    ...options,
  });
