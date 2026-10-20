import { expect } from "@effect/vitest";
import * as Effect from "effect/Effect";

import { apiTest } from "./helpers/api-test.ts";
import { isPresence, openClassroom, upgradeStatus } from "./helpers/classroom.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "classroom", allowedEmails: [] });

const teacher = "01CTCH00000000000000000000";
const ana = "01CSTA00000000000000000000";
const beto = "01CSTB00000000000000000000";
const carla = "01CSTC00000000000000000000";

const earlier = "01CSA000000000000000000000";
const featured = "01CSB000000000000000000000";
const disabled = "01CSD000000000000000000000";
const deleted = "01CSE000000000000000000000";

const statusFor = (userId: string, sessionId: string) =>
  Effect.gen(function* () {
    const { url } = yield* stack;

    return yield* upgradeStatus(url, sessionId, yield* cookieFor(userId));
  });

const enter = (userId: string, sessionId: string) =>
  Effect.gen(function* () {
    const { url } = yield* stack;

    return yield* openClassroom(url, sessionId, yield* cookieFor(userId));
  });

test(
  "a student enters the featured session and hears themselves present",
  Effect.scoped(
    Effect.gen(function* () {
      expect(yield* statusFor(ana, featured)).toBe(101);

      const socket = yield* enter(ana, featured);
      const presence = yield* socket.waitFor(isPresence([ana]));

      expect(presence).toEqual({
        type: "presence",
        people: [{ id: ana, name: "Ana", avatar: "fox", role: "student" }],
      });
    }),
  ),
);

test(
  "a student cannot enter an earlier session",
  Effect.gen(function* () {
    expect(yield* statusFor(ana, earlier)).toBe(404);
  }),
);

test(
  "a student cannot enter a disabled session",
  Effect.gen(function* () {
    expect(yield* statusFor(ana, disabled)).toBe(404);
  }),
);

test(
  "the teacher enters a disabled session",
  Effect.gen(function* () {
    expect(yield* statusFor(teacher, disabled)).toBe(101);
  }),
);

test(
  "the teacher cannot enter a deleted session",
  Effect.gen(function* () {
    expect(yield* statusFor(teacher, deleted)).toBe(404);
  }),
);

test(
  "without the cookie the upgrade is unauthenticated",
  Effect.gen(function* () {
    const { url } = yield* stack;

    expect(yield* upgradeStatus(url, featured, undefined)).toBe(401);
  }),
);

test(
  "a second person entering and leaving changes the presence of both",
  Effect.scoped(
    Effect.gen(function* () {
      const first = yield* enter(ana, featured);

      yield* first.waitFor(isPresence([ana]));

      const second = yield* enter(beto, featured);

      yield* first.waitFor(isPresence([ana, beto]));
      yield* second.waitFor(isPresence([ana, beto]));
      yield* second.close;
      yield* first.waitFor(isPresence([ana]));
    }),
  ),
);

test(
  "the same person in two tabs is present once and stays present after closing one",
  Effect.scoped(
    Effect.gen(function* () {
      const watcher = yield* enter(beto, featured);

      yield* watcher.waitFor(isPresence([beto]));

      const firstTab = yield* enter(ana, featured);

      yield* watcher.waitFor(isPresence([ana, beto]));

      const secondTab = yield* enter(ana, featured);
      const both = yield* secondTab.waitFor(isPresence([ana, beto]));

      expect(both.type === "presence" ? both.people : []).toHaveLength(2);
      yield* watcher.waitFor(isPresence([ana, beto]));
      yield* firstTab.close;

      // Closing a tab sends the presence again, and Ana is still in it.
      yield* watcher.waitFor(isPresence([ana, beto]));
      expect(yield* watcher.quietFor(isPresence([beto]))).toBe(true);
    }),
  ),
);

test(
  "presence keeps the name of the moment of connecting until the person reconnects",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const cookie = yield* cookieFor(carla);
      const before = yield* openClassroom(url, featured, cookie);

      yield* before.waitFor(isPresence([carla]));

      const renamed = yield* request(url, "PATCH", "/api/me", {
        cookie,
        body: { name: "Carla Nueva", avatar: "frog" },
      });

      expect(renamed.status).toBe(200);

      const watcher = yield* enter(beto, featured);
      const withOldName = yield* watcher.waitFor(isPresence([beto, carla]));

      expect(withOldName).toMatchObject({
        people: expect.arrayContaining([expect.objectContaining({ id: carla, name: "Carla" })]),
      });

      yield* before.close;
      yield* watcher.waitFor(isPresence([beto]));

      yield* openClassroom(url, featured, cookie);

      const withNewName = yield* watcher.waitFor(isPresence([beto, carla]));

      expect(withNewName).toMatchObject({
        people: expect.arrayContaining([
          expect.objectContaining({ id: carla, name: "Carla Nueva" }),
        ]),
      });
    }),
  ),
);
