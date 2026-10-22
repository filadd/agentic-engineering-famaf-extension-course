import { expect } from "@effect/vitest";
import * as Effect from "effect/Effect";

import { announce } from "./helpers/announce.ts";
import { apiTest } from "./helpers/api-test.ts";
import { mailsWithSubject } from "./helpers/sent-mail.ts";

const { test, stack, stage } = apiTest({
  name: "announcement-sixty",
  allowedEmails: ["profe@announcement-sixty.kurasu.test"],
});

test(
  "an announcement to 60 students goes in two batches of 49 and 11, with the teacher in To",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, "01ATCH00000000000000000000", {
      sessionId: "01AS0100000000000000000000",
      message: "Para todos",
      entryIds: ["01AE0100000000000000000000"],
    });

    expect(response.status).toBe(204);

    const mails = yield* mailsWithSubject(stage, 'Novedades de la sesión "Anuncio para 60"', 2);

    expect(mails.map((mail) => mail.bcc.length).toSorted((a, b) => b - a)).toEqual([49, 11]);
    expect(mails.map((mail) => mail.to)).toEqual([
      ["profe@announcement-sixty.kurasu.test"],
      ["profe@announcement-sixty.kurasu.test"],
    ]);
    expect(new Set(mails.flatMap((mail) => mail.bcc)).size).toBe(60);
  }),
);
