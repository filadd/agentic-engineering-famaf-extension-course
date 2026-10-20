import type { Session } from "@kurasu/contract/sessions";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useSession = (
  id: string,
  options?: QueryOptions<Session, EndpointError<"sessions", "get">>,
) =>
  useApiQuery({
    queryKey: queryKeys.session(id),
    call: (api) => api.sessions.get({ params: { id } }),
    options,
  });
