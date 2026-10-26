import { expect } from "@effect/vitest";
import {
  EmailTaken,
  NoAccess,
  NotRegistered,
  NotTeacher,
  OwnAccess,
} from "@kurasu/contract/errors";
import { EnrollmentCode, User } from "@kurasu/contract/user";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { bodyOf, failedWith } from "./helpers/body.ts";
import { apiTest } from "./helpers/api-test.ts";
import { request } from "./helpers/http.ts";
import { login, loginByMail } from "./helpers/login.ts";
import { linkCodeFor } from "./helpers/mail.ts";

const { test, stack } = apiTest({
  name: "admin-users",
  allowedEmails: [
    "profe@usuarios.kurasu.test",
    "bruno@usuarios.kurasu.test",
    "nuevo@usuarios.kurasu.test",
    "inscripto@usuarios.kurasu.test",
    "tarde@usuarios.kurasu.test",
  ],
});

const profe = "01M3TC5H13G99CJSZ03NS6AKSK";

const teacherLogin = (url: string) => loginByMail(url, "profe@usuarios.kurasu.test");

// The enrollment code tests run in order: the stage starts with no code, the
// first read creates it and the later ones reuse or regenerate it.
test(
  "the first read of the enrollment code creates five characters without 0, O, 1 or I, with the registration URL",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);
    const response = yield* request(url, "GET", "/api/admin/enrollment-code", { cookie });

    expect(response.status).toBe(200);

    const enrollment = yield* bodyOf(EnrollmentCode, response);

    expect(enrollment.code).toMatch(/^[A-HJ-NP-Z2-9]{5}$/);
    expect(enrollment.url).toContain(`/registro?codigo=${enrollment.code}`);
  }),
);

test(
  "reading the enrollment code again answers the same code",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);
    const first = yield* request(url, "GET", "/api/admin/enrollment-code", { cookie });
    const second = yield* request(url, "GET", "/api/admin/enrollment-code", { cookie });

    expect(second.status).toBe(200);
    expect((yield* bodyOf(EnrollmentCode, second)).code).toBe(
      (yield* bodyOf(EnrollmentCode, first)).code,
    );
  }),
);

test(
  "regenerating the enrollment code retires the old one and keeps who registered with it",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);
    const current = yield* request(url, "GET", "/api/admin/enrollment-code", { cookie });
    const old = (yield* bodyOf(EnrollmentCode, current)).code;

    yield* request(url, "POST", "/api/auth/link", {
      body: { email: "inscripto@usuarios.kurasu.test", enrollmentCode: old },
    });
    yield* login(url, yield* linkCodeFor("inscripto@usuarios.kurasu.test"));

    const regenerated = yield* request(url, "POST", "/api/admin/enrollment-code", { cookie });

    expect(regenerated.status).toBe(200);
    const next = (yield* bodyOf(EnrollmentCode, regenerated)).code;

    expect(next).not.toBe(old);
    expect(next).toMatch(/^[A-HJ-NP-Z2-9]{5}$/);

    const late = yield* request(url, "POST", "/api/auth/link", {
      body: { email: "tarde@usuarios.kurasu.test", enrollmentCode: old },
    });

    expect(late.status).toBe(404);
    expect(failedWith(late, NotRegistered)).toBe(true);

    const enrolled = yield* loginByMail(url, "inscripto@usuarios.kurasu.test");
    const me = yield* request(url, "GET", "/api/me", { cookie: enrolled });

    expect(me.status).toBe(200);
  }),
);

test(
  "the teacher lists every user with their access, themselves included",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);
    const response = yield* request(url, "GET", "/api/admin/users", { cookie });

    expect(response.status).toBe(200);

    const users = yield* bodyOf(Schema.Array(User), response);

    expect(users).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: profe, role: "teacher", hasAccess: true }),
        expect.objectContaining({ email: "ana@usuarios.kurasu.test", hasAccess: true }),
        expect.objectContaining({ email: "diego@usuarios.kurasu.test", hasAccess: false }),
      ]),
    );
  }),
);

test(
  "the users are listed by name and then by email, with the users without a name last",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    yield* request(url, "POST", "/api/admin/users", {
      cookie,
      body: { email: "sin-nombre@usuarios.kurasu.test" },
    });

    const response = yield* request(url, "GET", "/api/admin/users", { cookie });
    const users = yield* bodyOf(Schema.Array(User), response);
    const firstWithoutName = users.findIndex((user) => user.name == null);
    const named = users.slice(0, firstWithoutName);
    const unnamed = users.slice(firstWithoutName);

    expect(firstWithoutName).toBeGreaterThan(0);
    expect(named.map((user) => user.name)).toEqual(["Ana", "Bruno", "Carla", "Diego", "Profe"]);
    expect(unnamed.every((user) => user.name == null)).toBe(true);
    expect(unnamed.map((user) => user.email)).toEqual(unnamed.map((user) => user.email).toSorted());
  }),
);

test(
  "a student calling an admin endpoint is not a teacher",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "usuarios-ana-code");
    const response = yield* request(url, "GET", "/api/admin/users", { cookie });

    expect(response.status).toBe(403);
    expect(failedWith(response, NotTeacher)).toBe(true);
  }),
);

test(
  "adding a new email creates a student with access who can request the link",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    const added = yield* request(url, "POST", "/api/admin/users", {
      cookie,
      body: { email: "nuevo@usuarios.kurasu.test" },
    });

    expect(added.status).toBe(201);
    expect(added.body).toMatchObject({
      email: "nuevo@usuarios.kurasu.test",
      role: "student",
      hasAccess: true,
      name: null,
      avatar: null,
    });

    const link = yield* request(url, "POST", "/api/auth/link", {
      body: { email: "nuevo@usuarios.kurasu.test" },
    });

    expect(link.status).toBe(204);
  }),
);

test(
  "adding a valid email with spaces around and uppercase saves the normalized one",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    const added = yield* request(url, "POST", "/api/admin/users", {
      cookie,
      body: { email: "  Camila@Usuarios.Kurasu.Test  " },
    });

    expect(added.status).toBe(201);
    expect(added.body).toMatchObject({
      email: "camila@usuarios.kurasu.test",
      role: "student",
      hasAccess: true,
      name: null,
      avatar: null,
    });

    const list = yield* request(url, "GET", "/api/admin/users", { cookie });
    const users = yield* bodyOf(Schema.Array(User), list);

    expect(users.find((user) => user.email === "camila@usuarios.kurasu.test")).toMatchObject({
      email: "camila@usuarios.kurasu.test",
      hasAccess: true,
    });
  }),
);

test(
  "adding an email that already exists answers EmailTaken",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    const added = yield* request(url, "POST", "/api/admin/users", {
      cookie,
      body: { email: "ana@usuarios.kurasu.test" },
    });

    expect(added.status).toBe(409);
    expect(failedWith(added, EmailTaken)).toBe(true);
  }),
);

test(
  "adding an email with spaces and uppercase that already exists answers EmailTaken",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    const added = yield* request(url, "POST", "/api/admin/users", {
      cookie,
      body: { email: "  ANA@usuarios.Kurasu.Test  " },
    });

    expect(added.status).toBe(409);
    expect(failedWith(added, EmailTaken)).toBe(true);

    const list = yield* request(url, "GET", "/api/admin/users", { cookie });
    const users = yield* bodyOf(Schema.Array(User), list);

    expect(users.find((user) => user.email === "ana@usuarios.kurasu.test")).toMatchObject({
      email: "ana@usuarios.kurasu.test",
      hasAccess: true,
    });
  }),
);

test(
  "adding an email with a dot at the start, before the at sign or consecutive dots is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    const invalidEmails = [
      ".juan@usuarios.kurasu.test",
      "ezequiel.pastore.@mi.unc.edu.ar",
      "juan..perez@usuarios.kurasu.test",
    ];

    for (const email of invalidEmails) {
      const added = yield* request(url, "POST", "/api/admin/users", { cookie, body: { email } });

      expect(added.status).toBe(400);
    }

    const list = yield* request(url, "GET", "/api/admin/users", { cookie });
    const users = yield* bodyOf(Schema.Array(User), list);

    for (const email of invalidEmails) {
      expect(users.some((user) => user.email === email)).toBe(false);
    }
  }),
);

test(
  "adding an email that is empty, too long or has an invalid domain is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    const invalidEmails = ["", `${"a".repeat(300)}@usuarios.kurasu.test`, "juan@localhost"];

    for (const email of invalidEmails) {
      const added = yield* request(url, "POST", "/api/admin/users", { cookie, body: { email } });

      expect(added.status).toBe(400);
    }

    const list = yield* request(url, "GET", "/api/admin/users", { cookie });
    const users = yield* bodyOf(Schema.Array(User), list);

    for (const email of invalidEmails) {
      expect(users.some((user) => user.email === email)).toBe(false);
    }
  }),
);

test(
  "taking a student's access away makes their next request answer NoAccess",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const student = yield* login(url, "usuarios-carla-code");
    const cookie = yield* teacherLogin(url);

    const updated = yield* request(url, "PATCH", "/api/admin/users/01M3TC5H16SR8BD62VVFK3QSWJ", {
      cookie,
      body: { hasAccess: false },
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({ hasAccess: false });

    const me = yield* request(url, "GET", "/api/me", { cookie: student });

    expect(me.status).toBe(403);
    expect(failedWith(me, NoAccess)).toBe(true);
  }),
);

test(
  "giving the access back lets the student request the link",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    const updated = yield* request(url, "PATCH", "/api/admin/users/01M3TC5H152YGVFX6MAK4M9RPR", {
      cookie,
      body: { hasAccess: true },
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({ hasAccess: true });

    const link = yield* request(url, "POST", "/api/auth/link", {
      body: { email: "bruno@usuarios.kurasu.test" },
    });

    expect(link.status).toBe(204);
  }),
);

test(
  "the teacher cannot take their own access away",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* teacherLogin(url);

    const updated = yield* request(url, "PATCH", `/api/admin/users/${profe}`, {
      cookie,
      body: { hasAccess: false },
    });

    expect(updated.status).toBe(409);
    expect(failedWith(updated, OwnAccess)).toBe(true);
    expect((yield* request(url, "GET", "/api/me", { cookie })).status).toBe(200);
  }),
);
