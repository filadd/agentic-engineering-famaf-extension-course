import { randomUUID } from "node:crypto";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import * as Alchemy from "alchemy";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Test from "alchemy/Test/Vitest";

import { ApiStack } from "./stack.ts";

const fixturesFolder = join(dirname(fileURLToPath(import.meta.url)), "..", "fixtures");

export const testJwtSecret = "kurasu-api-tests-sign-their-sessions-with-this";

export interface Fixture {
  readonly name: string;
  readonly allowedEmails: ReadonlyArray<string>;
}

// Sets up a test file: a stage of its own that starts from an empty D1 and R2,
// applies the migrations and loads `test/fixtures/<name>.sql`. The mail
// binding only accepts `allowedEmails`, so a link for any other address fails.
// The stage name is new on every run, so a run never inherits the data of an
// earlier one; `afterAll` drops the stage's state. `stage` names the stage,
// whose log holds the mails it sent (see `sent-mail.ts`).
export const apiTest = (fixture: Fixture) => {
  process.env["JWT_SECRET"] = testJwtSecret;
  process.env["KURASU_D1_IMPORT_FILES"] = join(fixturesFolder, `${fixture.name}.sql`);
  process.env["KURASU_MAIL_ALLOWED_DESTINATIONS"] = fixture.allowedEmails.join(",");

  const stage = `test-${fixture.name}-${randomUUID().slice(0, 8)}`;

  const harness = Test.make({
    providers: Cloudflare.providers(),
    state: Alchemy.localState(),
    dev: true,
    stage,
  });

  const stack = harness.beforeAll(harness.deploy(ApiStack));

  harness.afterAll(harness.destroy(ApiStack));

  return { test: harness.test, stack, stage };
};
