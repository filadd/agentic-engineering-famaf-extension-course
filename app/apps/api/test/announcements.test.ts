import { expect } from "@effect/vitest";
import { EmptyAnnouncement, SessionDisabled, SessionNotFound } from "@kurasu/contract/errors";
import * as Effect from "effect/Effect";

import { announce, pendingIds } from "./helpers/announce.ts";
import { apiTest } from "./helpers/api-test.ts";
import { failedWith } from "./helpers/body.ts";
import { mailsWithSubject, noMailWithSubject } from "./helpers/sent-mail.ts";

const { test, stack, stage } = apiTest({
  name: "announcements",
  allowedEmails: ["profe@anuncios.kurasu.test"],
});

const teacher = "01ATCH00000000000000000000";

const session = (n: number) => `01AS${String(n).padStart(2, "0")}`.padEnd(26, "0");

const subjectOf = (title: string) => `Novedades de la sesión "${title}"`;

const studentsWithAccess = [
  "ana@anuncios.kurasu.test",
  "beto@anuncios.kurasu.test",
  "caro@anuncios.kurasu.test",
];

test(
  "an announcement with a message and two entries mails the users with access and deletes only those entries",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(1),
      message: "¡Nos vemos el jueves!",
      entryIds: ["01AE1B00000000000000000000", "01AE1A00000000000000000000"],
    });

    expect(response.status).toBe(204);

    const [mail, ...others] = yield* mailsWithSubject(stage, subjectOf("Anuncio completo"), 1);

    expect(others).toEqual([]);
    expect(mail?.to).toEqual(["profe@anuncios.kurasu.test"]);
    expect(mail?.bcc).toEqual(studentsWithAccess);
    expect(mail?.text).toContain("¡Nos vemos el jueves!");
    expect(mail?.text).toContain(
      'Novedades\n\n- Se habilitó la sesión "Anuncio completo".\n- Se agregó el material "slides.html".',
    );
    expect(mail?.text).toMatch(new RegExp(`Ir a la sesión:\\n\\S+/\\?sesion=${session(1)}\\n$`));
    expect(mail?.html).toContain(`/?sesion=${session(1)}`);
    expect(yield* pendingIds(url, teacher, session(1))).toEqual(["01AE1C00000000000000000000"]);
  }),
);

test(
  "an announcement with only a message has no entries block and deletes nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(2),
      message: "Solo un aviso",
      entryIds: [],
    });

    expect(response.status).toBe(204);

    const [mail] = yield* mailsWithSubject(stage, subjectOf("Solo mensaje"), 1);

    expect(mail?.text).toContain("Solo un aviso");
    expect(mail?.text).not.toContain("Novedades");
    expect(mail?.html).not.toContain("Novedades");
    expect(yield* pendingIds(url, teacher, session(2))).toEqual(["01AE0200000000000000000000"]);
  }),
);

test(
  "an announcement with only entries starts with them",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(3),
      message: "",
      entryIds: ["01AE0300000000000000000000"],
    });

    expect(response.status).toBe(204);

    const [mail] = yield* mailsWithSubject(stage, subjectOf("Solo novedades"), 1);

    expect(mail?.text.startsWith('Novedades\n\n- Se agregó el material "Apunte suelto".')).toBe(
      true,
    );
  }),
);

test(
  "a message of spaces without entries answers EmptyAnnouncement and sends nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(4),
      message: "   \n ",
      entryIds: [],
    });

    expect(response.status).toBe(400);
    expect(failedWith(response, EmptyAnnouncement)).toBe(true);
    expect(yield* noMailWithSubject(stage, subjectOf("Mensaje vacío"))).toBe(true);
  }),
);

test(
  "an announcement with more than 50 entries is rejected and sends nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(11),
      message: "Muchas novedades",
      entryIds: [
        "01AE1100000000000000000000",
        ...Array.from({ length: 50 }, (_, n) =>
          `01AX${String(n).padStart(2, "0")}`.padEnd(26, "0"),
        ),
      ],
    });

    expect(response.status).toBe(400);
    expect(yield* noMailWithSubject(stage, subjectOf("Demasiadas novedades"))).toBe(true);
    expect(yield* pendingIds(url, teacher, session(11))).toEqual(["01AE1100000000000000000000"]);
  }),
);

test(
  "chosen ids that are no longer pending in the session are left out without an error",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(5),
      message: "",
      entryIds: [
        "01AE9900000000000000000000",
        "01AE0500000000000000000000",
        "01AE0600000000000000000000",
      ],
    });

    expect(response.status).toBe(204);

    const [mail] = yield* mailsWithSubject(stage, subjectOf("Ids descartados"), 1);

    expect(mail?.text).toContain('- Se agregó el material "Apunte pendiente".');
    expect(mail?.text).not.toContain("Apunte de otra sesión");
    expect(yield* pendingIds(url, teacher, session(5))).toEqual([]);
    expect(yield* pendingIds(url, teacher, session(6))).toEqual(["01AE0600000000000000000000"]);
  }),
);

test(
  "only ids that are no longer pending and no message answer EmptyAnnouncement",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(7),
      message: "",
      entryIds: ["01AE9800000000000000000000"],
    });

    expect(response.status).toBe(400);
    expect(failedWith(response, EmptyAnnouncement)).toBe(true);
    expect(yield* noMailWithSubject(stage, subjectOf("Ids que no están"))).toBe(true);
  }),
);

test(
  "the announcement of the featured session links to the home",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(10),
      message: "La de hoy",
      entryIds: [],
    });

    expect(response.status).toBe(204);

    const [mail] = yield* mailsWithSubject(stage, subjectOf("Destacada"), 1);

    expect(mail?.text).toMatch(/Ir a la sesión:\nhttps?:\/\/[^/\s]+\/\n$/);
  }),
);

test(
  "the announcement of a disabled session answers SessionDisabled and sends nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(8),
      message: "No sale",
      entryIds: [],
    });

    expect(response.status).toBe(409);
    expect(failedWith(response, SessionDisabled)).toBe(true);
    expect(yield* noMailWithSubject(stage, subjectOf("Deshabilitada"))).toBe(true);
  }),
);

test(
  "the announcement of an unknown session answers SessionNotFound",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* announce(url, teacher, {
      sessionId: session(99),
      message: "No sale",
      entryIds: [],
    });

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "the message goes escaped with its line breaks as <br> in the HTML part and as written in the text part",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const message = '<b>Hola</b> & "chau"\nSegunda línea';

    const response = yield* announce(url, teacher, {
      sessionId: session(9),
      message,
      entryIds: [],
    });

    expect(response.status).toBe(204);

    const [mail] = yield* mailsWithSubject(stage, subjectOf("Mensaje con HTML"), 1);

    expect(mail?.html).toContain("&lt;b&gt;Hola&lt;/b&gt; &amp; &quot;chau&quot;<br>Segunda línea");
    expect(mail?.html).not.toContain("<b>Hola</b>");
    expect(mail?.text).toContain(message);
  }),
);
