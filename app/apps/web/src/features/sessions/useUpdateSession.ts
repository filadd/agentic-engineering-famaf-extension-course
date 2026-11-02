import type { Session, SessionChange, SessionSummary } from "@kurasu/contract/sessions";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface SessionUpdate {
  readonly id: string;
  readonly change: SessionChange;
}

// Only disabling a session that is not the featured one and the featured
// questions apply at once. The rest waits for the API, because it changes
// another session too: enabling, featuring and disabling the featured one.
const withPatch = <S extends SessionSummary>(session: S, { id, change }: SessionUpdate): S => {
  if (session.id !== id) {
    return session;
  }

  const patched = {
    ...session,
    featuredQuestions: change.featuredQuestions ?? session.featuredQuestions,
  };

  const isDisabling = change.enabled === false && change.featured == null && !session.featured;

  return isDisabling ? { ...patched, enabled: false } : patched;
};

const toastOf = ({ change }: SessionUpdate) => {
  if (change.featuredQuestions != null) {
    return "No se pudo cambiar las preguntas destacadas.";
  }

  return change.enabled === false && change.featured == null
    ? "No se pudo deshabilitar la sesión."
    : undefined;
};

export const useUpdateSession = (
  options?: MutationOptions<Session, SessionUpdate, EndpointError<"adminSessions", "update">>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminSessions.update({ params: { id: input.id }, payload: input.change }),
    invalidates: [
      queryKeys.sessions(),
      queryKeys.adminSessions(),
      queryKeys.allAdminChangelog(),
      queryKeys.allAdminPolls(),
      queryKeys.allAdminRaisedHands(),
    ],
    optimistic: [
      optimisticPatch<ReadonlyArray<SessionSummary>, SessionUpdate>({
        key: () => queryKeys.adminSessions(),
        exact: true,
        patch: (sessions, input) => sessions.map((session) => withPatch(session, input)),
      }),
      optimisticPatch<Session, SessionUpdate>({
        key: (input) => queryKeys.adminSession(input.id),
        patch: withPatch,
      }),
    ],
    errorToast: toastOf,
    options,
  });
