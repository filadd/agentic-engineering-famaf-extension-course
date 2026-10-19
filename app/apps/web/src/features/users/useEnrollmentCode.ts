import type { EnrollmentCode } from "@kurasu/contract/user";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const useEnrollmentCode = (options?: QueryOptions<EnrollmentCode>) =>
  useQuery({
    queryKey: queryKeys.enrollmentCode(),
    queryFn: () => runApi((api) => api.adminUsers.getEnrollmentCode()),
    ...options,
  });
