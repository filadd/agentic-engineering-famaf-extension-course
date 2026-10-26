import { expect } from "@effect/vitest";
import { InvalidLink, MailNotSent, NoAccess, NotRegistered } from "@kurasu/contract/errors";
import { User } from "@kurasu/contract/user";
import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { bodyOf, failedWith } from "./helpers/body.ts";
import { apiTest } from "./helpers/api-test.ts";
import { request } from "./helpers/http.ts";
import { login, loginByMail } from "./helpers/login.ts";
import { linkCodeFor, mailSentSince } from "./helpers/mail.ts";

const { test, stack } = apiTest({
  name: "auth",
  allowedEmails: [
    "profe@auth.kurasu.test",
    "lucia@auth.kurasu.test",
    "marta@auth.kurasu.test",
    "sinacceso@auth.kurasu.test",
    "pedro@auth.kurasu.test",
    "rosa@auth.kurasu.test",
    "tomas@auth.kurasu.test",
    "nuevo@auth.kurasu.test",
    "nadie@auth.kurasu.test",
    "otro@auth.kurasu.test",
    "minusculas@auth.kurasu.test",
    "largo@auth.kurasu.test",
  ],
});

interface LinkRequest {
  readonly email: string;
  readonly enrollmentCode?: string;
}

const requestLink = (url: string, body: LinkRequest) =>
  request(url, "POST", "/api/auth/link", { body });

const openSession = (url: string, code: string) =>
  request(url, "POST", "/api/auth/session", { body: { code } });

const allUsers = (url: string) =>
  Effect.gen(function* () {
    const cookie = yield* loginByMail(url, "profe@auth.kurasu.test");
    const response = yield* request(url, "GET", "/api/admin/users", { cookie });

    return yield* bodyOf(Schema.Array(User), response);
  });

test(
  "an account with access gets a mail with the link to open",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* requestLink(url, { email: "lucia@auth.kurasu.test" });

    expect(response.status).toBe(204);

    const code = yield* linkCodeFor("lucia@auth.kurasu.test");
    const opened = yield* openSession(url, code);

    expect(opened.status).toBe(200);
    expect(opened.body).toMatchObject({ email: "lucia@auth.kurasu.test" });
  }),
);

test(
  "a login that sends the email with spaces and uppercase gets the link of the normalized account",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const since = yield* Clock.currentTimeMillis;
    const response = yield* requestLink(url, { email: "  Lucia@Auth.Kurasu.Test  " });

    expect(response.status).toBe(204);
    expect(yield* mailSentSince("lucia@auth.kurasu.test", since)).toBe(true);
  }),
);

test(
  "a new email with the current enrollment code registers a student and gets the link",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* requestLink(url, {
      email: "nuevo@auth.kurasu.test",
      enrollmentCode: "H4XQ9",
    });

    expect(response.status).toBe(204);

    const users = yield* allUsers(url);

    expect(users.find((user) => user.email === "nuevo@auth.kurasu.test")).toMatchObject({
      role: "student",
      hasAccess: true,
      name: null,
      avatar: null,
    });

    const opened = yield* openSession(url, yield* linkCodeFor("nuevo@auth.kurasu.test"));

    expect(opened.status).toBe(200);
  }),
);

test(
  "a new email with spaces around and uppercase registers the normalized account and gets the link",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const since = yield* Clock.currentTimeMillis;

    const response = yield* requestLink(url, {
      email: "  Nuevo@Auth.Kurasu.Test  ",
      enrollmentCode: "H4XQ9",
    });

    expect(response.status).toBe(204);
    expect(yield* mailSentSince("nuevo@auth.kurasu.test", since)).toBe(true);

    const users = yield* allUsers(url);

    expect(users.find((user) => user.email === "nuevo@auth.kurasu.test")).toMatchObject({
      role: "student",
      hasAccess: true,
      name: null,
      avatar: null,
    });

    const opened = yield* openSession(url, yield* linkCodeFor("nuevo@auth.kurasu.test"));

    expect(opened.status).toBe(200);
  }),
);

test(
  "a new email with the current enrollment code typed in lowercase registers too",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* requestLink(url, {
      email: "minusculas@auth.kurasu.test",
      enrollmentCode: "h4xq9",
    });

    expect(response.status).toBe(204);

    const opened = yield* openSession(url, yield* linkCodeFor("minusculas@auth.kurasu.test"));

    expect(opened.status).toBe(200);
    expect(opened.body).toMatchObject({ email: "minusculas@auth.kurasu.test", role: "student" });
  }),
);

test(
  "the link of the mail keeps a long code, unlike the five characters of the enrollment code",
  Effect.gen(function* () {
    const { url } = yield* stack;

    yield* requestLink(url, { email: "largo@auth.kurasu.test", enrollmentCode: "H4XQ9" });

    expect(yield* linkCodeFor("largo@auth.kurasu.test")).toMatch(/^[0-9a-f]{48}$/);
  }),
);

test(
  "an existing account that sends the current enrollment code logs in without a second user",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const before = yield* allUsers(url);

    const response = yield* requestLink(url, {
      email: "marta@auth.kurasu.test",
      enrollmentCode: "H4XQ9",
    });

    expect(response.status).toBe(204);
    expect((yield* allUsers(url)).length).toBe(before.length);

    const opened = yield* openSession(url, yield* linkCodeFor("marta@auth.kurasu.test"));

    expect(opened.body).toMatchObject({ id: "01M3TC5H02R3DDXBRZGJH8XK1K" });
  }),
);

test(
  "an email with no account and no code is not registered and gets no mail",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const since = yield* Clock.currentTimeMillis;
    const response = yield* requestLink(url, { email: "nadie@auth.kurasu.test" });

    expect(response.status).toBe(404);
    expect(failedWith(response, NotRegistered)).toBe(true);
    expect(yield* mailSentSince("nadie@auth.kurasu.test", since)).toBe(false);

    const users = yield* allUsers(url);

    expect(users.some((user) => user.email === "nadie@auth.kurasu.test")).toBe(false);
  }),
);

test(
  "a new email with an enrollment code that was regenerated is not registered",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* requestLink(url, {
      email: "otro@auth.kurasu.test",
      enrollmentCode: "W8MRT",
    });

    expect(response.status).toBe(404);
    expect(failedWith(response, NotRegistered)).toBe(true);
  }),
);

test(
  "an account without access gets no link even with the current enrollment code",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const since = yield* Clock.currentTimeMillis;

    const response = yield* requestLink(url, {
      email: "sinacceso@auth.kurasu.test",
      enrollmentCode: "H4XQ9",
    });

    expect(response.status).toBe(403);
    expect(failedWith(response, NoAccess)).toBe(true);
    expect(yield* mailSentSince("sinacceso@auth.kurasu.test", since)).toBe(false);
  }),
);

test(
  "a mail that does not go out answers MailNotSent and a second request replaces the code",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const first = yield* requestLink(url, { email: "fuera@auth.kurasu.test" });

    expect(first.status).toBe(502);
    expect(failedWith(first, MailNotSent)).toBe(true);

    const second = yield* requestLink(url, { email: "fuera@auth.kurasu.test" });

    expect(second.status).toBe(502);
    expect(failedWith(second, MailNotSent)).toBe(true);
  }),
);

test(
  "an email with a dot at the start, before the at sign or consecutive dots is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const since = yield* Clock.currentTimeMillis;

    const invalidEmails = [
      ".juan@auth.kurasu.test",
      "ezequiel.pastore.@mi.unc.edu.ar",
      "juan..perez@auth.kurasu.test",
    ];

    for (const email of invalidEmails) {
      const response = yield* requestLink(url, { email });

      expect(response.status).toBe(400);
      expect(yield* mailSentSince(email, since)).toBe(false);
    }

    const users = yield* allUsers(url);

    for (const email of invalidEmails) {
      expect(users.some((user) => user.email === email)).toBe(false);
    }
  }),
);

test(
  "an email that is empty, too long, has inner spaces or an invalid domain is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const since = yield* Clock.currentTimeMillis;

    const invalidEmails = [
      "",
      `${"a".repeat(300)}@auth.kurasu.test`,
      "juan perez@auth.kurasu.test",
      "juan@localhost",
    ];

    for (const email of invalidEmails) {
      const response = yield* requestLink(url, { email });

      expect(response.status).toBe(400);
      expect(yield* mailSentSince(email, since)).toBe(false);
    }

    const users = yield* allUsers(url);

    for (const email of invalidEmails) {
      expect(users.some((user) => user.email === email)).toBe(false);
    }
  }),
);

test(
  "opening a current link answers Me and sets the week-long session cookie",
  Effect.gen(function* () {
    const { url } = yield* stack;

    yield* requestLink(url, { email: "pedro@auth.kurasu.test" });

    const opened = yield* openSession(url, yield* linkCodeFor("pedro@auth.kurasu.test"));

    expect(opened.status).toBe(200);
    expect(opened.body).toEqual({
      id: "01M3TC5H05CG5QE1JFEGAF189E",
      email: "pedro@auth.kurasu.test",
      name: "Pedro",
      avatar: "lion",
      role: "student",
    });

    const cookie = opened.headers["set-cookie"] ?? "";
    const attributes = cookie.split(";").map((part) => part.trim().toLowerCase());

    expect(cookie).toMatch(/^session=[^;]+/);
    expect(attributes).toEqual(
      expect.arrayContaining(["httponly", "secure", "samesite=lax", "path=/", "max-age=604800"]),
    );
  }),
);

test(
  "a link opens only once",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const first = yield* openSession(url, "auth-dario-code");
    const second = yield* openSession(url, "auth-dario-code");

    expect(first.status).toBe(200);
    expect(second.status).toBe(401);
    expect(failedWith(second, InvalidLink)).toBe(true);
  }),
);

test(
  "the link of an earlier request stops working and the newest one opens",
  Effect.gen(function* () {
    const { url } = yield* stack;

    yield* requestLink(url, { email: "rosa@auth.kurasu.test" });

    const earlier = yield* linkCodeFor("rosa@auth.kurasu.test");

    yield* requestLink(url, { email: "rosa@auth.kurasu.test" });

    const newest = yield* linkCodeFor("rosa@auth.kurasu.test");

    expect(newest).not.toBe(earlier);

    const stale = yield* openSession(url, earlier);

    expect(stale.status).toBe(401);
    expect(failedWith(stale, InvalidLink)).toBe(true);
    expect((yield* openSession(url, newest)).status).toBe(200);
  }),
);

test(
  "a link of someone whose access was taken away answers NoAccess and is used up",
  Effect.gen(function* () {
    const { url } = yield* stack;

    yield* requestLink(url, { email: "tomas@auth.kurasu.test" });

    const code = yield* linkCodeFor("tomas@auth.kurasu.test");
    const teacher = yield* loginByMail(url, "profe@auth.kurasu.test");

    yield* request(url, "PATCH", "/api/admin/users/01M3TC5H07ZYPFVSCWN28TE4TX", {
      cookie: teacher,
      body: { hasAccess: false },
    });

    const first = yield* openSession(url, code);

    expect(first.status).toBe(403);
    expect(failedWith(first, NoAccess)).toBe(true);
    expect((yield* openSession(url, code)).status).toBe(401);
  }),
);

test(
  "two openings of the same link at once let only one in",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const statuses = yield* Effect.all(
      [openSession(url, "auth-julia-code"), openSession(url, "auth-julia-code")],
      { concurrency: "unbounded" },
    ).pipe(
      Effect.map((responses) =>
        responses.map((response) => response.status).toSorted((a, b) => a - b),
      ),
    );

    expect(statuses).toEqual([200, 401]);
  }),
);

test(
  "logging out clears the cookie and the next request is unauthenticated",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "auth-leo-code");
    const response = yield* request(url, "POST", "/api/auth/logout", { cookie });

    expect(response.status).toBe(204);

    const cleared = response.headers["set-cookie"] ?? "";

    expect(cleared).toMatch(/^session=;/);
    expect(cleared.toLowerCase()).toContain("max-age=0");

    const me = yield* request(url, "GET", "/api/me", { cookie: cleared.split(";")[0] ?? "" });

    expect(me.status).toBe(401);
  }),
);
