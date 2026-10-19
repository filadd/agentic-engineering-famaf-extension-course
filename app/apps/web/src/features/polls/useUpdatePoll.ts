import type { AdminPoll, PollChange } from "@kurasu/contract/polls";

import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface PollUpdate {
  readonly id: string;
  readonly change: PollChange;
}

export const useUpdatePoll = (
  options?: MutationOptions<AdminPoll, PollUpdate, EndpointError<"adminPolls", "update">>,
) =>
  useApiMutation({
    call: (api, input) =>
      api.adminPolls.update({ params: { id: input.id }, payload: input.change }),
    invalidates: [queryKeys.allPolls(), queryKeys.allAdminPolls()],
    options,
  });
