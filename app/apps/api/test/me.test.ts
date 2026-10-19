import { expect } from "@effect/vitest";
import { NoAccess, Unauthenticated } from "@kurasu/contract/errors";
import * as Clock from "effect/Clock";
import * as Effect from "effect/Effect";
import { SignJWT } from "jose";

import { failedWith } from "./helpers/body.ts";
import { apiTest, testJwtSecret } from "./helpers/api-test.ts";
import { request } from "./helpers/http.ts";
import { login, loginByMail } from "./helpers/login.ts";
import { linkCodeFor } from "./helpers/mail.ts";

const { test, stack } = apiTest({
  name: "me",
  allowedEmails: ["profe@me.kurasu.test", "nueva@me.kurasu.test"],
});

const ana = "01M3TC5H0TT9NDP9EHB2FBE382";

// A session cookie with a token the API did not issue, signed with `secret`
// and expiring at `expiresAt`, in seconds since the epoch.
const forgedCookie = (secret: string, expiresAt: number) =>
  Effect.promise(() =>
    new SignJWT({})
      .setProtectedHeader({ alg: "HS256" })
      .setSubject(ana)
      .setIssuedAt(expiresAt - 60)
      .setExpirationTime(expiresAt)
      .sign(new TextEncoder().encode(secret)),
  ).pipe(Effect.map((token) => `session=${token}`));

test(
  "a valid cookie of a user with a full profile answers their Me",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "me-ana-code");
    const me = yield* request(url, "GET", "/api/me", { cookie });

    expect(me.status).toBe(200);
    expect(me.body).toEqual({
      id: ana,
      email: "ana@me.kurasu.test",
      name: "Ana",
      avatar: "fox",
      role: "student",
    });
  }),
);

test(
  "a student who just registered has no name and no avatar",
  Effect.gen(function* () {
    const { url } = yield* stack;

    yield* request(url, "POST", "/api/auth/link", {
      body: { email: "nueva@me.kurasu.test", enrollmentCode: "M3ENR" },
    });

    const cookie = yield* login(url, yield* linkCodeFor("nueva@me.kurasu.test"));
    const me = yield* request(url, "GET", "/api/me", { cookie });

    expect(me.status).toBe(200);
    expect(me.body).toMatchObject({
      email: "nueva@me.kurasu.test",
      name: null,
      avatar: null,
      role: "student",
    });
  }),
);

test(
  "a request without the cookie is unauthenticated",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const me = yield* request(url, "GET", "/api/me");

    expect(me.status).toBe(401);
    expect(failedWith(me, Unauthenticated)).toBe(true);
  }),
);

test(
  "a cookie signed with another secret is unauthenticated",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const now = yield* Clock.currentTimeMillis;

    const cookie = yield* forgedCookie(
      "a-secret-that-is-not-the-one-of-the-api",
      Math.floor(now / 1000) + 3600,
    );

    const me = yield* request(url, "GET", "/api/me", { cookie });

    expect(me.status).toBe(401);
    expect(failedWith(me, Unauthenticated)).toBe(true);
  }),
);

test(
  "an expired cookie is unauthenticated",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const now = yield* Clock.currentTimeMillis;
    const cookie = yield* forgedCookie(testJwtSecret, Math.floor(now / 1000) - 60);
    const me = yield* request(url, "GET", "/api/me", { cookie });

    expect(me.status).toBe(401);
    expect(failedWith(me, Unauthenticated)).toBe(true);
  }),
);

test(
  "a valid cookie of someone whose access was taken away answers NoAccess",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "me-bruno-code");
    const teacher = yield* loginByMail(url, "profe@me.kurasu.test");

    yield* request(url, "PATCH", "/api/admin/users/01M3TC5H0V0SQQCZZ26N1T09N6", {
      cookie: teacher,
      body: { hasAccess: false },
    });

    const me = yield* request(url, "GET", "/api/me", { cookie });

    expect(me.status).toBe(403);
    expect(failedWith(me, NoAccess)).toBe(true);
  }),
);

test(
  "a student completes their profile",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "me-carla-code");

    const updated = yield* request(url, "PATCH", "/api/me", {
      cookie,
      body: { name: "Carla", avatar: "polar-bear" },
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({ name: "Carla", avatar: "polar-bear", role: "student" });

    const me = yield* request(url, "GET", "/api/me", { cookie });

    expect(me.body).toMatchObject({ name: "Carla", avatar: "polar-bear" });
  }),
);

test(
  "the teacher edits their profile",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* loginByMail(url, "profe@me.kurasu.test");

    const updated = yield* request(url, "PATCH", "/api/me", {
      cookie,
      body: { name: "La profe", avatar: "dragon" },
    });

    expect(updated.status).toBe(200);
    expect(updated.body).toMatchObject({ name: "La profe", avatar: "dragon", role: "teacher" });
  }),
);

test(
  "an empty name is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "me-diego-code");

    const updated = yield* request(url, "PATCH", "/api/me", {
      cookie,
      body: { name: "", avatar: "fox" },
    });

    expect(updated.status).toBe(400);
    expect((yield* request(url, "GET", "/api/me", { cookie })).body).toMatchObject({
      name: "Diego",
    });
  }),
);

test(
  "a name of 41 characters is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "me-elena-code");

    const updated = yield* request(url, "PATCH", "/api/me", {
      cookie,
      body: { name: "a".repeat(41), avatar: "fox" },
    });

    expect(updated.status).toBe(400);
  }),
);

test(
  "an avatar that is an emoji or a made-up key is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* login(url, "me-fede-code");

    const update = (avatar: string) =>
      request(url, "PATCH", "/api/me", { cookie, body: { name: "Fede", avatar } });

    expect((yield* update("🦊")).status).toBe(400);
    expect((yield* update("griffin")).status).toBe(400);
    expect((yield* request(url, "GET", "/api/me", { cookie })).body).toMatchObject({
      avatar: "dog",
    });
  }),
);
