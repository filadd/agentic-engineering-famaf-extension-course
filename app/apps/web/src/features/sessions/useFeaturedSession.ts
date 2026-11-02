import type { SessionSummary } from "@kurasu/contract/sessions";

import type { EndpointError, QueryOptions } from "../../api/api-error.ts";
import { useAdminSessions } from "./useAdminSessions.ts";

const findFeatured = (sessions: ReadonlyArray<SessionSummary>) =>
  sessions.find((session) => session.featured);

// The featured session of the admin's list, or undefined while there is none.
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
