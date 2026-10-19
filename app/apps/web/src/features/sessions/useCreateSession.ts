import type { Session, SessionInput } from "@kurasu/contract/sessions";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useCreateSession = (options?: MutationOptions<Session, SessionInput>) =>
  useApiMutation({
    call: (api, input) => api.adminSessions.create({ payload: input }),
    invalidates: [queryKeys.sessions(), queryKeys.adminSessions()],
    options,
  });
