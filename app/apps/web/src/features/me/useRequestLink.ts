import type { EndpointError, MutationOptions } from "../../api/api-error.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export interface LinkRequest {
  readonly email: string;
  readonly enrollmentCode?: string;
}

// NoAccess here is an answer the form shows, not a session that lost access,
// so the query client leaves it to the screen.
export const useRequestLink = (
  options?: MutationOptions<void, LinkRequest, EndpointError<"auth", "requestLink">>,
) =>
  useApiMutation({
    call: (api, input) => api.auth.requestLink({ payload: input }),
    options: { meta: { ownsAccessErrors: true }, ...options },
  });
