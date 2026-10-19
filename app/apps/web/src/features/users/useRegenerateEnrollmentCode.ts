import type { EnrollmentCode } from "@kurasu/contract/user";

import type { MutationOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiMutation } from "../../api/useApiMutation.ts";

export const useRegenerateEnrollmentCode = (options?: MutationOptions<EnrollmentCode, void>) =>
  useApiMutation({
    call: (api) => api.adminUsers.regenerateEnrollmentCode(),
    invalidates: [queryKeys.enrollmentCode()],
    options,
  });
