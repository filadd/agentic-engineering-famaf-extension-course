import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useMaterials = (
  sessionId: string,
  options?: QueryOptions<ReadonlyArray<Material>, SessionNotFound>,
) =>
  useQuery({
    queryKey: queryKeys.materials(sessionId),
    queryFn: () => runApi((api) => api.materials.list({ query: { sessionId } })),
    ...options,
  });
