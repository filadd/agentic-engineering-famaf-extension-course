# kurasu: API shape

verified: 2026-10-18

Answers how kurasu's HTTP API is laid out: what is a route, what is a filter, and what travels inside a resource.

## Knowledge

- Each resource has one endpoint, never nested: `/api/<resource>` and `/api/<resource>/{id}`.
- The student uses `/api/<resource>` and the teacher `/api/admin/<resource>`; each side gets only the operations it needs.
- The id of another resource goes in as a filter (`?sessionId=`) or in the body, never in the path.
- A resource includes the values that belong to it: the student's vote is a field of the poll (`myResponse`) and of the question (`myVote`), set with a `PATCH` on that resource.
- A list returns a summary and the detail returns the full resource (`SessionSummary` and `Session`).
- Actions that are not resources, such as requesting a login link or opening a session, stay as actions under `/api/auth/`.
- Every endpoint also answers the access middleware's errors: `Unauthenticated`, `NoAccess`, and `NotTeacher` on `/api/admin`.

## Sources

- `.scratch/aula-virtual/program-design/kurasu.md`, branches 3 and 4.
