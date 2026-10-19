import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Session } from "@kurasu/contract/sessions";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useSession = (id: string, options?: QueryOptions<Session, SessionNotFound>) =>
  useQuery({
    queryKey: queryKeys.session(id),
    queryFn: () => runApi((api) => api.sessions.get({ params: { id } })),
    ...options,
  });
