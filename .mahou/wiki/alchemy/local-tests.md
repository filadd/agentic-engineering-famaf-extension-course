# Testing against Alchemy's local stack

verified: 2026-10-22

Answers how integration tests run against a local Alchemy 2 stack: how much state a test file gets, how to start from a clean database with fixtures, how to read and fail the mail a Worker sends, and what cannot be made to fail. The facts come from the alchemy source at 2.0.0-beta.83 (commit 9e3c058) and its issues. kurasu's API suite applies them: it deploys one stage per file, loads the fixtures through `importFiles`, reads the mail from `text/*.txt` and the recipients from the stage's Worker log, makes sends fail with `allowedDestinationAddresses`, and sets `sequence.hooks: "list"`.

## Knowledge

- `alchemy/Test/Vitest` with `dev: true` deploys the stack once per `Test.make` call, in `beforeAll`, so once per test file.
- Local data lives in `.alchemy/local/` (`d1/`, `r2/`, `email/`, …) and is shared by every stage. Each local D1 and R2 gets a `dev:<uuid>` id the first time Alchemy reconciles it, stored in the stage's state row. A stage with no state row gets a new id and starts empty.
- There is no API to reset a local D1 or R2 between tests. `destroy` keeps the data, because the local `delete` handlers do nothing. To start clean, deploy a new stage (`Test.make({ stage })` or `deploy(Stack, { stage })`) per test file, or delete `.alchemy/local` and `.alchemy/state` between runs.
- Migrations apply on every deploy. `D1.Database({ importFiles: ["<fixtures>.sql"] })` runs SQL after the migrations, and skips a file whose hash has not changed. The tests of one file share that data, so each test creates or uses its own records.
- The test process has no public client for the local D1. The local D1 and R2 simulators keep their data in SQLite files under `.alchemy/local/d1/cloudflare-runtime-D1DatabaseObject` and `.alchemy/local/r2/cloudflare-runtime-R2BucketObject`, one file per database or bucket named by a hash, plus `metadata.sqlite`. A test opens them read-only with `node:sqlite`, because the stage's Worker keeps them open. The files outlive their stage, so a test finds its stage's database by a value new to the run, such as a record it just created. kurasu reads them through `test/helpers/local-sqlite.ts`, used by `d1.ts` and `r2.ts`.
- The local `send_email` binding writes each message to `.alchemy/local/email/` and logs the path. The builder form (`.send({ from, to, subject, text, html })`) writes `text/<uuid>.txt` and `html/<uuid>.html`, and no `.eml`. Only `sendRaw` with a MIME message writes `<uuid>.eml`. A test reads the files with `fs`. The folder is shared by every file and run, so a test looks for a value unique to that test. The files hold only the bodies. The sender, the recipients (`To`, `Cc`, `Bcc`) and the subject are in the line `send_email binding called with MessageBuilder:` that the binding logs to the Worker's console, which Alchemy writes to `.alchemy/log/<stage>/<worker>/<timestamp>.log` while the test runs; the line also gives the paths of the body files. `allowedDestinationAddresses` checks only `to`, not `bcc`.
- To make a send fail without mocks, declare `allowedDestinationAddresses` (or `allowedSenderAddresses`) on `Cloudflare.Email.SendEmail` for the test stage. A send to an address outside the list throws `email to <addr> not allowed`, which reaches the Worker as `SendEmailError`. The list is fixed at deploy time.
- The harness has no way to make a Durable Object call fail: no fault injection, no eviction and no abort switch.
- Each run of a suite that deploys a stage per file leaves the stages' state, bundles and local data behind. In kurasu's API suite, each run adds about 130 MB to `apps/api/.alchemy`, and nothing removes it.
- Under Vitest's default `sequence.hooks: "stack"`, `afterAll(destroy(Stack))` hangs with `dev: true` (issue #2118). Set `sequence.hooks: "list"`, or use `Test.make({ sidecar: false })`, or drop the `afterAll` destroy.

## Sources

- alchemy at 9e3c058: `packages/alchemy/src/Test/Vitest.ts`, `Test/Core.ts`, `Cloudflare/D1/Database.ts`, `Cloudflare/R2/Bucket.ts`, `packages/cloudflare-runtime/src/core/bindings/send-email/SendEmailBinding.worker.ts`, `packages/alchemy/test/Cloudflare/Email/SendEmail.local.test.ts`: https://github.com/alchemy-run/alchemy/tree/9e3c058
- Issue #2118: https://github.com/alchemy-run/alchemy/issues/2118
- kurasu: `app/apps/api/test/helpers/api-test.ts`, `app/apps/api/vitest.config.ts`, `.scratch/aula-virtual/implement/report-refactor.md`.
