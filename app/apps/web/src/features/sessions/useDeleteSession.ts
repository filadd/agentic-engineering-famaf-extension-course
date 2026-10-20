import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useDeleteSession = (
  options?: MutationOptions<void, string, EndpointError<"adminSessions", "delete">>,
) =>
  useApiMutation({
    call: (api, input) => api.adminSessions.delete({ params: { id: input } }),
    invalidates: [queryKeys.sessions(), queryKeys.adminSessions()],
    options,
  });
