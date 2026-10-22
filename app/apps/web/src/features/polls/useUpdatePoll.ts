import type { AdminPoll, PollChange } from "@kurasu/contract/polls";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { optimisticPatch } from "../../api/optimistic-patch.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface PollUpdate {
  readonly id: string;
  readonly change: PollChange;
}

const statusFailures = {
  active: "No se pudo activar la encuesta.",
  closed: "No se pudo cerrar la encuesta.",
} as const;

// Activating and closing are immediate; saving a draft waits for the API in
// its own card.
export const useUpdatePoll = (
  options?: MutationOptions<AdminPoll, PollUpdate, EndpointError<"adminPolls", "update">>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminPolls.update({ params: { id: input.id }, payload: input.change }),
    invalidates: [queryKeys.allPolls(), queryKeys.allAdminPolls(), queryKeys.allAdminChangelog()],
    optimistic: [
      optimisticPatch<ReadonlyArray<AdminPoll>, PollUpdate>({
        key: () => queryKeys.allAdminPolls(),
        patch: (polls, { id, change }) =>
          polls.map((poll) =>
            poll.id !== id || change.status == null ? poll : { ...poll, status: change.status },
          ),
      }),
    ],
    errorToast: ({ change }) => (change.status == null ? undefined : statusFailures[change.status]),
    options,
  });
