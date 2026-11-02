import type { SessionSummary } from "@kurasu/contract/sessions";

import type { RailNodeLook } from "./RailNode.tsx";

export type RailLook = Exclude<RailNodeLook, "locked" | "new">;

export const railLook = (
  session: Pick<SessionSummary, "position">,
  featuredPosition: number | undefined,
): RailLook => {
  if (featuredPosition == null || session.position > featuredPosition) {
    return "later";
  }

  return session.position === featuredPosition ? "live" : "done";
};
