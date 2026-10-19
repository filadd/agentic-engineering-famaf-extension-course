# kurasu: checks and tests

verified: 2026-10-18

Answers which checks reject code in kurasu and where its tests live.

## Knowledge

- oxlint runs type-aware with every rule as an error; oxfmt formats the code.
- A local plugin enforces boundaries: `apps/web` imports only `@kurasu/contract` and `@kurasu/slides` among the project's packages; `packages/core` imports no Cloudflare, Alchemy, Drizzle or jose; `packages/*` never import `apps/*`.
- TypeScript rules: `== null` instead of `=== null` or `=== undefined`; no enums (a const map and a derived type); named exports only.
- React rules: arrow-function components with a `Props` interface; React imported by name; conditional rendering with a ternary, never `&&`; no nested ternaries; one component per file; no destructured `useQuery` or `useMutation`.
- The project copies anti-slop into `tools/oxlint/anti-slop/` and adapts it as its own, with its generic and Effect rules.
- `@effect/tsgo` makes `tsc` fail on Effect diagnostics: missing services, `any` in error channels, global `Date`, `fetch` or `console` inside Effect.
- lefthook runs check and test on every commit; nobody commits with `--no-verify`.
- Tests are integration tests only, in `apps/api/test` (Alchemy's `alchemy/Test/Vitest` in dev mode, HTTP and WebSocket against the local stack) and `apps/web/test` (screens with the real router, the API answered by MSW, Testing Library on happy-dom). A package gets its own tests only when its logic is too complex to cover through the API or the web. Tests do not mock modules.
- Each API test file deploys its own stage: an empty D1 and R2, the migrations, and its fixtures loaded with `importFiles`. The tests in a file share that database, so each test uses its own records. The test stage sets `allowedDestinationAddresses` to the fixtures' emails; a link requested for an email outside the list makes the mail fail. A test reads the mail from the file the local binding writes under `.alchemy/local/email`.
- There are no end-to-end tests. Rows marked `test + manual` in the test design are also run by hand with agent-browser against the local stack (`alchemy dev` and Vite).

## Sources

- `.scratch/aula-virtual/program-design/kurasu.md`, branch 9 and Standards.
- `.scratch/aula-virtual/research-tests-alchemy.md`.
- `.scratch/aula-virtual/research-stack-local.md` and `.scratch/aula-virtual/test-design/kurasu.md`.
