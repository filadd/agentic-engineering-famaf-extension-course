import type { VisiblePollStatus } from "@kurasu/contract/polls";

export interface PollFilters {
  readonly sessionId?: string;
  readonly status?: VisiblePollStatus;
}

// Lists that belong to a session carry `{ sessionId }`, so the classroom can
// invalidate everything of one session by matching that object. The `all*`
// keys are the prefixes a mutation invalidates every list of a resource with.
export const queryKeys = {
  me: () => ["me"] as const,
  sessions: () => ["sessions"] as const,
  session: (id: string) => ["sessions", id] as const,
  adminSessions: () => ["admin", "sessions"] as const,
  adminSession: (id: string) => ["admin", "sessions", id] as const,
  allPolls: () => ["polls"] as const,
  allAdminPolls: () => ["admin", "polls"] as const,
  polls: (filters: PollFilters) => ["polls", filters] as const,
  adminPolls: (sessionId: string) => ["admin", "polls", { sessionId }] as const,
  allMaterials: () => ["materials"] as const,
  allAdminMaterials: () => ["admin", "materials"] as const,
  materials: (sessionId: string) => ["materials", { sessionId }] as const,
  adminMaterials: (sessionId: string) => ["admin", "materials", { sessionId }] as const,
  materialFile: (id: string) => ["material-file", id] as const,
  allAdminChangelog: () => ["admin", "changelog"] as const,
  adminChangelog: (sessionId: string) => ["admin", "changelog", { sessionId }] as const,
  allQuestions: () => ["questions"] as const,
  allAdminQuestions: () => ["admin", "questions"] as const,
  questions: (sessionId: string) => ["questions", { sessionId }] as const,
  adminQuestions: (sessionId: string) => ["admin", "questions", { sessionId }] as const,
  allRaisedHands: () => ["raised-hands"] as const,
  allAdminRaisedHands: () => ["admin", "raised-hands"] as const,
  raisedHands: (sessionId: string) => ["raised-hands", { sessionId }] as const,
  adminRaisedHands: (sessionId: string) => ["admin", "raised-hands", { sessionId }] as const,
  users: () => ["admin", "users"] as const,
  enrollmentCode: () => ["admin", "enrollment-code"] as const,
};
