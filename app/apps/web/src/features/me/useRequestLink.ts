import type { MailNotSent, NoAccess, NotRegistered } from "@kurasu/contract/errors";
import { useMutation } from "@tanstack/react-query";

import type { MutationOptions } from "../../api/api-error.ts";
import { runApi } from "../../api/run-api.ts";

export interface LinkRequest {
  readonly email: string;
  readonly enrollmentCode?: string;
}

// NoAccess here is an answer the form shows, not a session that lost access,
// so the query client leaves it to the screen.
export const useRequestLink = (
  options?: MutationOptions<void, LinkRequest, NoAccess | NotRegistered | MailNotSent>,
) =>
  useMutation({
    meta: { ownsAccessErrors: true },
    ...options,
    mutationFn: (input) => runApi((api) => api.auth.requestLink({ payload: input })),
  });
