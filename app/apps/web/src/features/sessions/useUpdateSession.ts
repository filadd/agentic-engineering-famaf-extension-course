import type { Session, SessionChange, SessionSummary } from "@kurasu/contract/sessions";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface SessionUpdate {
  readonly id: string;
  readonly change: SessionChange;
}

const withEnabled = <S extends SessionSummary>(session: S, { id, change }: SessionUpdate): S =>
  session.id !== id || change.enabled == null ? session : { ...session, enabled: change.enabled };

// Only the enabled switch is immediate; saving the title and summary waits for
// the API in its own form.
export const useUpdateSession = (
  options?: MutationOptions<Session, SessionUpdate, EndpointError<"adminSessions", "update">>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminSessions.update({ params: { id: input.id }, payload: input.change }),
    invalidates: [queryKeys.sessions(), queryKeys.adminSessions(), queryKeys.allAdminChangelog()],
    optimistic: [
      optimisticPatch<ReadonlyArray<SessionSummary>, SessionUpdate>({
        key: () => queryKeys.adminSessions(),
        exact: true,
        patch: (sessions, input) => sessions.map((session) => withEnabled(session, input)),
      }),
      optimisticPatch<Session, SessionUpdate>({
        key: (input) => queryKeys.adminSession(input.id),
        patch: withEnabled,
      }),
    ],
    errorToast: ({ change }) =>
      change.enabled == null
        ? undefined
        : `No se pudo ${change.enabled ? "habilitar" : "deshabilitar"} la sesión.`,
    options,
  });
