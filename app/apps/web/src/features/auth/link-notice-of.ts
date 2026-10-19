import * as Predicate from "effect/Predicate";

import type { LinkNotice } from "./link-notices.ts";

// What the email step shows for each way POST /api/auth/link can fail.
export const linkNoticeOf = (error: Error, enrolling: boolean): LinkNotice => {
  if (Predicate.isTagged(error, "NoAccess")) {
    return "noAccess";
  }

  if (Predicate.isTagged(error, "NotRegistered")) {
    return enrolling ? "badCode" : "notRegistered";
  }

  return "mailNotSent";
};
