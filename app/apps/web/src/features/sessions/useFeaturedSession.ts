import type { SessionSummary } from "@kurasu/contract/sessions";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { findFeatured } from "./find-featured.ts";
import { useAdminSessions } from "./useAdminSessions.ts";

export const useFeaturedSession = (
  options?: Omit<
    QueryOptions<
      ReadonlyArray<SessionSummary>,
      EndpointError<"adminSessions", "list">,
      SessionSummary | undefined
    >,
    "select"
  >,
) => useAdminSessions({ ...options, select: findFeatured });
