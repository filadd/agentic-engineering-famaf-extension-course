import type { ClassroomTopic } from "@kurasu/contract/classroom";
import type { QueryClient } from "@tanstack/react-query";

import { queryKeys } from "../../api/query-keys.ts";
import { sessionScoped } from "../../api/session-scoped.ts";
import type { SessionResource } from "../../api/session-scoped.ts";

const resources: Partial<Record<ClassroomTopic, SessionResource>> = {
  polls: "polls",
  material: "materials",
  questions: "questions",
  hands: "raised-hands",
};

const invalidateDetail = (queryClient: QueryClient, sessionId: string) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.session(sessionId), exact: true }),
    queryClient.invalidateQueries({ queryKey: queryKeys.adminSession(sessionId), exact: true }),
  ]);

export const invalidateSessionLists = (queryClient: QueryClient) =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.sessions(), exact: true }),
    queryClient.invalidateQueries({ queryKey: queryKeys.adminSessions(), exact: true }),
  ]);

// What each notice of the classroom makes the web ask for again: the slide
// lives in the session's detail, a session change touches the lists too, and
// the rest are the lists of that session.
export const invalidateTopic = async (
  queryClient: QueryClient,
  sessionId: string,
  topic: ClassroomTopic,
) => {
  const resource = resources[topic];

  if (resource != null) {
    await queryClient.invalidateQueries({ predicate: sessionScoped(sessionId, [resource]) });

    return;
  }

  await Promise.all([
    invalidateDetail(queryClient, sessionId),
    topic === "session" ? invalidateSessionLists(queryClient) : undefined,
  ]);
};

export const invalidateClassroom = (queryClient: QueryClient, sessionId: string) =>
  Promise.all([
    invalidateDetail(queryClient, sessionId),
    queryClient.invalidateQueries({
      predicate: sessionScoped(sessionId, ["polls", "materials", "questions", "raised-hands"]),
    }),
  ]);
