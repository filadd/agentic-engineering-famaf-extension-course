import type { PollNotFound } from "@kurasu/contract/errors";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useDeletePoll = (options?: MutationOptions<void, string, PollNotFound>) =>
  useApiMutation({
    call: (api, input) => api.adminPolls.delete({ params: { id: input } }),
    invalidates: [queryKeys.allPolls(), queryKeys.allAdminPolls()],
    options,
  });
