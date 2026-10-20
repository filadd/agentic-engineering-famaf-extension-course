import type { AdminPoll, PollStatus } from "@kurasu/contract/polls";

const rank: Record<PollStatus, number> = { active: 0, draft: 1, closed: 2 };

// Active polls first, then drafts, then closed ones.
export const byStatus = (polls: ReadonlyArray<AdminPoll>) =>
  polls.toSorted((a, b) => rank[a.status] - rank[b.status]);
