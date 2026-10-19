import type { SessionEnabled, SessionNotFound } from "@kurasu/contract/errors";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useDeleteSession = (
  options?: MutationOptions<void, string, SessionNotFound | SessionEnabled>,
) =>
  useApiMutation({
    call: (api, input) => api.adminSessions.delete({ params: { id: input } }),
    invalidates: [queryKeys.sessions(), queryKeys.adminSessions()],
    options,
  });
