import type { SessionSummary } from "@kurasu/contract/sessions";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useReorderSessions = (
  options?: MutationOptions<void, ReadonlyArray<string>, EndpointError<"adminSessions", "reorder">>,
) =>
  useApiMutation({
    call: (api, ids) => api.adminSessions.reorder({ payload: { ids } }),
    invalidates: [queryKeys.adminSessions(), queryKeys.sessions()],
    optimistic: [
      optimisticPatch<ReadonlyArray<SessionSummary>, ReadonlyArray<string>>({
        key: () => queryKeys.adminSessions(),
        exact: true,
        patch: (sessions, ids) =>
          ids.flatMap((id, index) => {
            const session = sessions.find((each) => each.id === id);

            return session == null ? [] : [{ ...session, position: index + 1 }];
          }),
      }),
    ],
    errorToast: () => "No se pudo reordenar.",
    options,
  });
