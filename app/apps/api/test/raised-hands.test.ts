import { expect } from "@effect/vitest";
import { SessionNotFound } from "@kurasu/contract/errors";
import { RaisedHand, RaisedHandSummary } from "@kurasu/contract/raised-hands";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { bodyOf, failedWith } from "./helpers/body.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "raised-hands", allowedEmails: [] });

const teacher = "01HTCH00000000000000000000";
const ana = "01HSTA00000000000000000000";
const beto = "01HSTB00000000000000000000";

const toRaise = "01HSA000000000000000000000";
const disabled = "01HSB000000000000000000000";
const twoHands = "01HSC000000000000000000000";
const toLowerOwn = "01HSD000000000000000000000";
const toLowerByTeacher = "01HSE000000000000000000000";

const studentHands = (url: string, sessionId: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(ana);

    const response = yield* request(url, "GET", `/api/raised-hands?sessionId=${sessionId}`, {
      cookie,
    });

    expect(response.status).toBe(200);

    return yield* bodyOf(Schema.Array(RaisedHandSummary), response);
  });

const owners = (hands: ReadonlyArray<RaisedHandSummary>) =>
  hands.map((hand) => hand.userId).toSorted();

test(
  "the student sees every hand of the session, with only whose it is",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(ana);

    const response = yield* request(url, "GET", `/api/raised-hands?sessionId=${twoHands}`, {
      cookie,
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(
      expect.arrayContaining([
        { sessionId: twoHands, userId: ana },
        { sessionId: twoHands, userId: beto },
      ]),
    );
    expect(JSON.stringify(response.body)).not.toContain("Ana");
  }),
);

test(
  "the hands of a disabled session answer SessionNotFound",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(ana);

    const response = yield* request(url, "GET", `/api/raised-hands?sessionId=${disabled}`, {
      cookie,
    });

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "raising the hand answers it with the student's name and avatar",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(ana);

    const response = yield* request(url, "POST", "/api/raised-hands", {
      cookie,
      body: { sessionId: toRaise },
    });

    expect(response.status).toBe(201);
    expect(yield* bodyOf(RaisedHand, response)).toEqual({
      sessionId: toRaise,
      user: { id: ana, name: "Ana", avatar: "fox" },
    });
  }),
);

test(
  "raising a raised hand succeeds and leaves a single hand",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(beto);

    const response = yield* request(url, "POST", "/api/raised-hands", {
      cookie,
      body: { sessionId: toRaise },
    });

    expect(response.status).toBe(201);
    expect((yield* studentHands(url, toRaise)).filter((hand) => hand.userId === beto)).toHaveLength(
      1,
    );
  }),
);

test(
  "lowering one's own hand leaves the others",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(ana);

    const response = yield* request(url, "DELETE", `/api/raised-hands?sessionId=${toLowerOwn}`, {
      cookie,
    });

    expect(response.status).toBe(204);
    expect(owners(yield* studentHands(url, toLowerOwn))).toEqual([beto]);
  }),
);

test(
  "the teacher sees the hands with their names and avatars",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* request(url, "GET", `/api/admin/raised-hands?sessionId=${twoHands}`, {
      cookie,
    });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Schema.Array(RaisedHand), response)).toEqual(
      expect.arrayContaining([
        { sessionId: twoHands, user: { id: ana, name: "Ana", avatar: "fox" } },
        { sessionId: twoHands, user: { id: beto, name: "Beto", avatar: "panda" } },
      ]),
    );
  }),
);

test(
  "the teacher lowers a student's hand",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* request(
      url,
      "DELETE",
      `/api/admin/raised-hands?sessionId=${toLowerByTeacher}&userId=${ana}`,
      { cookie },
    );

    expect(response.status).toBe(204);
    expect(yield* studentHands(url, toLowerByTeacher)).toEqual([]);
  }),
);
