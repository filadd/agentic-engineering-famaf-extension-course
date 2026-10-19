import type { EnrollmentCode } from "@kurasu/contract/user";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const useEnrollmentCode = (options?: QueryOptions<EnrollmentCode>) =>
  useApiQuery({
    queryKey: queryKeys.enrollmentCode(),
    call: (api) => api.adminUsers.getEnrollmentCode(),
    options,
  });
