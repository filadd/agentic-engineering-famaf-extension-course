import type { SessionNotFound } from "@kurasu/contract/errors";
import type { Poll } from "@kurasu/contract/polls";
import { useQuery } from "@tanstack/react-query";

import type { QueryOptions } from "../../api/api-error.ts";
import { queryKeys } from "../../api/query-keys.ts";
import type { PollFilters } from "../../api/query-keys.ts";
import { runApi } from "../../api/run-api.ts";

export const usePolls = (
  filters: PollFilters,
  options?: QueryOptions<ReadonlyArray<Poll>, SessionNotFound>,
) =>
  useQuery({
    queryKey: queryKeys.polls(filters),
    queryFn: () => runApi((api) => api.polls.list({ query: filters })),
    ...options,
  });
