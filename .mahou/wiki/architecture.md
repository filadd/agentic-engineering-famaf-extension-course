# kurasu: architecture rules

verified: 2026-10-19

Answers how kurasu's backend code is split and which rules its Effect code follows.

## Knowledge

- `packages/core` defines services named after a job (sessions, polls, access, mailer) and their ports. It imports no adapter and nothing from Cloudflare, Alchemy, Drizzle or jose.
- Adapters live outside core: the D1 adapters in `packages/database`, the R2, Email Sending, JWT and Durable Object adapters in `apps/api`. The apps wire the core services to their adapters; packages never import apps.
- Expected failures are typed errors declared with Schema; the code does not catch defects as if they were expected.
- Decode everything that enters at a boundary (a request body, a stored row, a message) with its schema before using it.
- The Worker reads configuration with Effect `Config` where it is built and passes it to the layers as plain values (`Access.layer(webOrigin)`, `JoseSessionTokens(jwtSecret)`). Secrets come from varlock: `.env.schema` declares them and `.env.local`, out of git, holds them. The mail binding and the D1 resource also read two test-only variables, `KURASU_MAIL_ALLOWED_DESTINATIONS` and `KURASU_D1_IMPORT_FILES`, which `.env.schema` declares without a default, so `Config.option` reads them as absent outside the API tests.
- Declare Alchemy resources outside the Worker's runtime path, because a Worker's initialization runs once at deploy and again when the isolate starts. The API Worker builds its HTTP app, with every layer that reads D1, inside `fetch`, because the bindings exist only when the isolate starts (see `alchemy/local-dev`).
- Reads are bounded (a list has a maximum) and paginate by key, not by offset.
- D1 has no transactions: writes that must land together go in one batch.

## Sources

- `.scratch/aula-virtual/program-design/kurasu.md`, branches 1 to 4 and Standards.
- `app/apps/api/src/worker.ts`.
