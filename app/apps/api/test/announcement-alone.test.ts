import { expect } from "@effect/vitest";
import * as Effect from "effect/Effect";

import { announce, pendingIds } from "./helpers/announce.ts";
import { apiTest } from "./helpers/api-test.ts";
import { noMailWithSubject } from "./helpers/sent-mail.ts";

const { test, stack, stage } = apiTest({
  name: "announcement-alone",
  allowedEmails: ["profe@solo.kurasu.test"],
});

const teacher = "01ATCH00000000000000000000";
const session = "01AS0100000000000000000000";

test(
  "when the teacher is the only user with access, nothing is mailed and the included entries are deleted",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session,
      message: "¿Hay alguien?",
      entryIds: ["01AE0100000000000000000000"],
    });

    expect(response.status).toBe(204);
    expect(yield* noMailWithSubject(stage, 'Novedades de la sesión "Sin estudiantes"')).toBe(true);
    expect(yield* pendingIds(url, teacher, session)).toEqual([]);
  }),
);
