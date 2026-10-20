import type { Query } from "@tanstack/react-query";

export type SessionResource = "polls" | "materials" | "questions" | "raised-hands";

const filterOf = (key: ReadonlyArray<unknown>) => key.at(-1);

const sessionIdOf = (key: ReadonlyArray<unknown>) => {
  const filter = filterOf(key);

  return filter instanceof Object && "sessionId" in filter ? filter.sessionId : undefined;
};

const resourceOf = (key: ReadonlyArray<unknown>) => (key[0] === "admin" ? key[1] : key[0]);

// Matches the student's and the teacher's lists of one resource of a session,
// whatever other filters they carry.
export const sessionScoped =
  (sessionId: string, resources: ReadonlyArray<SessionResource>) => (query: Query) =>
    sessionIdOf(query.queryKey) === sessionId &&
    resources.some((resource) => resource === resourceOf(query.queryKey));
