import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Session } from "@kurasu/contract/sessions";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useAdminSession = (id: string, options?: QueryOptions<Session, SessionNotFound>) =>
  useApiQuery({
    queryKey: queryKeys.adminSession(id),
    call: (api) => api.adminSessions.get({ params: { id } }),
    options,
  });
