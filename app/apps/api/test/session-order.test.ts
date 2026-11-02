import { expect } from "@effect/vitest";
import { OrderMismatch } from "@kurasu/contract/errors";
import { SessionSummary } from "@kurasu/contract/sessions";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { bodyOf, failedWith } from "./helpers/body.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "session-order", allowedEmails: [] });

const teacher = "01SRPRF0000000000000000000";
const student = "01SRSTD0000000000000000000";

const a = "01SRA000000000000000000000";
const b = "01SRB000000000000000000000";
const c = "01SRC000000000000000000000";

const listIds = (url: string, userId: string, path: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(userId);
    const response = yield* request(url, "GET", path, { cookie });
    const sessions = yield* bodyOf(Schema.Array(SessionSummary), response);

    return sessions.map((session) => session.id);
  });

const reorder = (url: string, ids: ReadonlyArray<string>) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(teacher);

    return yield* request(url, "PUT", "/api/admin/session-order", { cookie, body: { ids } });
  });

test(
  "reordering puts both lists in the new order and keeps the same featured session",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* reorder(url, [c, a, b]);

    expect(response.status).toBe(204);
    expect(yield* listIds(url, teacher, "/api/admin/sessions")).toEqual([c, a, b]);

    expect(yield* listIds(url, student, "/api/sessions")).toEqual([c, a, b]);

    const cookie = yield* cookieFor(teacher);

    const sessions = yield* bodyOf(
      Schema.Array(SessionSummary),
      yield* request(url, "GET", "/api/admin/sessions", { cookie }),
    );

    expect(sessions.filter((session) => session.featured).map((session) => session.id)).toEqual([
      c,
    ]);
  }),
);

test(
  "a reorder that leaves out or adds a session answers OrderMismatch and keeps the order",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const before = yield* listIds(url, teacher, "/api/admin/sessions");
    const missing = yield* reorder(url, [a, b]);
    const extra = yield* reorder(url, [a, b, c, "01SRZ000000000000000000000"]);
    const repeated = yield* reorder(url, [a, b, b]);

    expect(missing.status).toBe(409);
    expect(failedWith(missing, OrderMismatch)).toBe(true);
    expect(extra.status).toBe(409);
    expect(repeated.status).toBe(409);
    expect(yield* listIds(url, teacher, "/api/admin/sessions")).toEqual(before);
  }),
);
