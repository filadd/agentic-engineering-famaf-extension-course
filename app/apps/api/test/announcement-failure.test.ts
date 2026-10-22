import { expect } from "@effect/vitest";
import { MailNotSent } from "@kurasu/contract/errors";
import * as Effect from "effect/Effect";

import { announce, pendingIds } from "./helpers/announce.ts";
import { apiTest } from "./helpers/api-test.ts";
import { failedWith } from "./helpers/body.ts";

// The teacher's address is outside the mail binding's allowed destinations, so
// every batch, which goes to the teacher, fails. An empty list would mean no
// list at all.
const { test, stack } = apiTest({
  name: "announcement-failure",
  allowedEmails: ["ana@falla.kurasu.test"],
});

const teacher = "01ATCH00000000000000000000";
const session = "01AS0100000000000000000000";

test(
  "when no batch goes out the announcement answers MailNotSent and keeps the entries",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session,
      message: "No sale",
      entryIds: ["01AE0100000000000000000000"],
    });

    expect(response.status).toBe(502);
    expect(failedWith(response, MailNotSent)).toBe(true);
    expect(yield* pendingIds(url, teacher, session)).toEqual(["01AE0100000000000000000000"]);
  }),
);
