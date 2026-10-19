import type { Session, SessionChange } from "@kurasu/contract/sessions";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface SessionUpdate {
  readonly id: string;
  readonly change: SessionChange;
}

export const useUpdateSession = (
  options?: MutationOptions<Session, SessionUpdate, EndpointError<"adminSessions", "update">>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminSessions.update({ params: { id: input.id }, payload: input.change }),
    invalidates: [queryKeys.sessions(), queryKeys.adminSessions()],
    options,
  });
