# Testing against Alchemy's local stack

verified: 2026-10-18

Answers how integration tests run against a local Alchemy 2 stack: how much state a test file gets, how to start from a clean database with fixtures, how to read and fail the mail a Worker sends, and what cannot be made to fail. The facts come from the alchemy source at 2.0.0-beta.83 (commit 9e3c058) and its issues. Nobody has checked them against a real stack yet.

## Knowledge

- `alchemy/Test/Vitest` with `dev: true` deploys the stack once per `Test.make` call, in `beforeAll`, so once per test file.
- Local data lives in `.alchemy/local/` (`d1/`, `r2/`, `email/`, …) and is shared by every stage. Each local D1 and R2 gets a `dev:<uuid>` id the first time Alchemy reconciles it, stored in the stage's state row. A stage with no state row gets a new id and starts empty.
- There is no API to reset a local D1 or R2 between tests. `destroy` keeps the data, because the local `delete` handlers do nothing. To start clean, deploy a new stage (`Test.make({ stage })` or `deploy(Stack, { stage })`) per test file, or delete `.alchemy/local` and `.alchemy/state` between runs.
- Migrations apply on every deploy. `D1.Database({ importFiles: ["<fixtures>.sql"] })` runs SQL after the migrations, and skips a file whose hash has not changed. The tests of one file share that data, so each test creates or uses its own records.
- The test process has no public client for the local D1. `D1.QueryDatabase` with `QueryDatabaseLocal` exists for deploy-time actions; nobody has checked whether a test body can use it.
- The local `send_email` binding writes each message to `.alchemy/local/email/` and logs the path. The builder form (`.send({ from, to, subject, text, html })`) writes `text/<uuid>.txt` and `html/<uuid>.html`, and no `.eml`. Only `sendRaw` with a MIME message writes `<uuid>.eml`. A test reads the files with `fs`. The folder is shared by every file and run, so a test looks for a value unique to that test.
- To make a send fail without mocks, declare `allowedDestinationAddresses` (or `allowedSenderAddresses`) on `Cloudflare.Email.SendEmail` for the test stage. A send to an address outside the list throws `email to <addr> not allowed`, which reaches the Worker as `SendEmailError`. The list is fixed at deploy time.
- The harness has no way to make a Durable Object call fail: no fault injection, no eviction and no abort switch.
- Under Vitest's default `sequence.hooks: "stack"`, `afterAll(destroy(Stack))` hangs with `dev: true` (issue #2118). Set `sequence.hooks: "list"`, or use `Test.make({ sidecar: false })`, or drop the `afterAll` destroy.

## Sources

- alchemy at 9e3c058: `packages/alchemy/src/Test/Vitest.ts`, `Test/Core.ts`, `Cloudflare/D1/Database.ts`, `Cloudflare/R2/Bucket.ts`, `packages/cloudflare-runtime/src/core/bindings/send-email/SendEmailBinding.worker.ts`, `packages/alchemy/test/Cloudflare/Email/SendEmail.local.test.ts`: https://github.com/alchemy-run/alchemy/tree/9e3c058
- Issue #2118: https://github.com/alchemy-run/alchemy/issues/2118
