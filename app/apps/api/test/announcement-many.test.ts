import { expect } from "@effect/vitest";
import * as Effect from "effect/Effect";

import { announce } from "./helpers/announce.ts";
import { apiTest } from "./helpers/api-test.ts";
import { mailsWithSubject } from "./helpers/sent-mail.ts";

const { test, stack, stage } = apiTest({
  name: "announcement-many",
  allowedEmails: ["profe@announcement-many.kurasu.test"],
});

const student = (n: number) =>
  `estudiante${String(n).padStart(3, "0")}@announcement-many.kurasu.test`;

test(
  "an announcement to 120 students reaches the first 99 who registered, in batches of 49, 49 and 1",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, "01ATCH00000000000000000000", {
      sessionId: "01AS0100000000000000000000",
      message: "Para muchos",
      entryIds: [],
    });

    expect(response.status).toBe(204);

    const mails = yield* mailsWithSubject(stage, 'Novedades de la sesión "Anuncio para 120"', 3);
    const reached = mails.flatMap((mail) => mail.bcc);

    expect(mails.map((mail) => mail.bcc.length).toSorted((a, b) => b - a)).toEqual([49, 49, 1]);
    expect(reached.toSorted()).toEqual(
      Array.from({ length: 99 }, (_, index) => student(index + 1)),
    );
  }),
);
