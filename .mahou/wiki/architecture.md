# kurasu: architecture rules

verified: 2026-10-18

Answers how kurasu's backend code is split and which rules its Effect code follows.

## Knowledge

- `packages/core` defines services named after a job (sessions, polls, access, mailer) and their ports. It imports no adapter and nothing from Cloudflare, Alchemy, Drizzle or jose.
- Adapters live outside core: the D1 adapters in `packages/database`, the R2, Email Sending, JWT and Durable Object adapters in `apps/api`. The apps wire the core services to their adapters; packages never import apps.
- Expected failures are typed errors declared with Schema; the code does not catch defects as if they were expected.
- Decode everything that enters at a boundary (a request body, a stored row, a message) with its schema before using it.
- Each Layer validates its configuration while it builds; secrets come from varlock (`.env.schema` declares them, `.env.local` holds them, out of git).
- Declare Alchemy resources outside the Worker's runtime path, because a Worker's initialization runs once at deploy and again when the isolate starts.
- Reads are bounded (a list has a maximum) and paginate by key, not by offset.
- D1 has no transactions: writes that must land together go in one batch.

## Sources

- `.scratch/aula-virtual/program-design/kurasu.md`, branches 1 to 4 and Standards.
