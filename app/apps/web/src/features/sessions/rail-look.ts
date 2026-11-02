import type { SessionSummary } from "@kurasu/contract/sessions";

// Before the featured session the node is done, on it live, after it, or with
// no featured session, later.
export const railLook = (
  session: Pick<SessionSummary, "position">,
  featuredPosition: number | undefined,
) => {
  if (featuredPosition == null || session.position > featuredPosition) {
    return "later";
  }

  return session.position === featuredPosition ? "live" : "done";
};
