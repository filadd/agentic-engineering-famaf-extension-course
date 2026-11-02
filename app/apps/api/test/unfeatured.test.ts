import { expect } from "@effect/vitest";
import { SessionSummary } from "@kurasu/contract/sessions";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { upgradeStatus } from "./helpers/classroom.ts";
import { bodyOf } from "./helpers/body.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "unfeatured", allowedEmails: [] });

const teacher = "01NTCH00000000000000000000";
const ana = "01NSTA00000000000000000000";

const first = "01NSA000000000000000000000";
const last = "01NSB000000000000000000000";

test(
  "with no featured session a student enters no classroom, not even the last enabled one",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(ana);

    expect(yield* upgradeStatus(url, first, cookie)).toBe(404);
    expect(yield* upgradeStatus(url, last, cookie)).toBe(404);
  }),
);

test(
  "with no featured session the teacher still enters any classroom",
  Effect.gen(function* () {
    const { url } = yield* stack;

    expect(yield* upgradeStatus(url, last, yield* cookieFor(teacher))).toBe(101);
  }),
);

test(
  "with no featured session no session of either list is marked and the last enabled one is not featured on its own",
  Effect.gen(function* () {
    const { url } = yield* stack;

    for (const [userId, path] of [
      [ana, "/api/sessions"],
      [teacher, "/api/admin/sessions"],
    ] as const) {
      const cookie = yield* cookieFor(userId);

      const sessions = yield* bodyOf(
        Schema.Array(SessionSummary),
        yield* request(url, "GET", path, { cookie }),
      );

      expect(sessions.map((session) => session.id)).toEqual([first, last]);
      expect(sessions.every((session) => !session.featured)).toBe(true);
    }
  }),
);
