import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Poll } from "@kurasu/contract/polls";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import type { PollFilters } from "../../api/query-keys.ts";
import { useApiQuery } from "../../api/useApiQuery.ts";

export const usePolls = (
  filters: PollFilters,
  options?: QueryOptions<ReadonlyArray<Poll>, SessionNotFound>,
) =>
  useApiQuery({
    queryKey: queryKeys.polls(filters),
    call: (api) => api.polls.list({ query: filters }),
    options,
  });
