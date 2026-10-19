import type { SessionNotFound } from "@kurasu/contract/errors";
import type { AdminPoll, PollDraft } from "@kurasu/contract/polls";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useCreatePoll = (options?: MutationOptions<AdminPoll, PollDraft, SessionNotFound>) =>
  useApiMutation({
    call: (api, input) => api.adminPolls.create({ payload: input }),
    invalidates: [queryKeys.allPolls(), queryKeys.allAdminPolls()],
    options,
  });
