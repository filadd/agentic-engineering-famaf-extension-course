import { expect } from "@effect/vitest";
import { SessionEnabled, SessionNotFound } from "@kurasu/contract/errors";
import { Poll } from "@kurasu/contract/polls";
import { RaisedHandSummary } from "@kurasu/contract/raised-hands";
import { Session, type SessionChange, SessionSummary } from "@kurasu/contract/sessions";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { isChanged, openClassroom } from "./helpers/classroom.ts";
import { bodyOf, failedWith } from "./helpers/body.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "sessions", allowedEmails: [] });

const teacher = "01SSPRF0000000000000000000";
const student = "01SSSTD0000000000000000000";

const first = "01SSA100000000000000000000";
const disabled = "01SSB200000000000000000000";
const deleted = "01SSC300000000000000000000";
const toEdit = "01SSD400000000000000000000";
const featured = "01SSE500000000000000000000";
const toMove = "01SSF600000000000000000000";
const zeroPosition = "01SSG700000000000000000000";
const toDelete = "01SSH800000000000000000000";
const enabled = "01SSJ900000000000000000000";
const toEnable = "01SSK100000000000000000000";

const Summaries = Schema.Array(SessionSummary);

const studentList = (url: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(student);

    return yield* bodyOf(Summaries, yield* request(url, "GET", "/api/sessions", { cookie }));
  });

const teacherList = (url: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(teacher);

    return yield* bodyOf(Summaries, yield* request(url, "GET", "/api/admin/sessions", { cookie }));
  });

const positions = (sessions: ReadonlyArray<SessionSummary>) =>
  sessions.map((session) => session.position);

const ascending = (values: ReadonlyArray<number>) => values.toSorted((a, b) => a - b);

const patch = (url: string, id: string, body: SessionChange) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(teacher);

    return yield* request(url, "PATCH", `/api/admin/sessions/${id}`, { cookie, body });
  });

test(
  "the student lists only the enabled sessions, by position, without enabled",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const sessions = yield* studentList(url);
    const ids = sessions.map((session) => session.id);

    expect(ids).toEqual(
      (yield* teacherList(url)).filter((session) => session.enabled).map((session) => session.id),
    );
    expect(ids).toContain(first);
    expect(ids).not.toContain(disabled);
    expect(ids).not.toContain(deleted);
    expect(positions(sessions)).toEqual(ascending(positions(sessions)));
    expect(sessions.every((session) => !("enabled" in session))).toBe(true);
    expect(sessions.every((session) => !("currentSlide" in session))).toBe(true);
  }),
);

test(
  "the student reads an enabled session with the teacher's position",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(student);
    const response = yield* request(url, "GET", `/api/sessions/${first}`, { cookie });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Session, response)).toEqual({
      id: first,
      title: "Primera",
      summary: "La primera sesión",
      position: 1,
      currentSlide: 3,
      currentStep: 2,
    });
  }),
);

test(
  "the student cannot read a disabled session",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(student);
    const response = yield* request(url, "GET", `/api/sessions/${disabled}`, { cookie });

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "the teacher lists every session not deleted, with enabled, by position",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const sessions = yield* teacherList(url);
    const ids = sessions.map((session) => session.id);

    expect(ids).toEqual(expect.arrayContaining([first, disabled, toEdit, toEnable]));
    expect(ids).not.toContain(deleted);
    expect(sessions.find((session) => session.id === disabled)?.enabled).toBe(false);
    expect(sessions.find((session) => session.id === first)?.enabled).toBe(true);
    expect(positions(sessions)).toEqual(ascending(positions(sessions)));
  }),
);

test(
  "the teacher reads a disabled session with its position",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);
    const response = yield* request(url, "GET", `/api/admin/sessions/${disabled}`, { cookie });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Session, response)).toMatchObject({
      id: disabled,
      enabled: false,
      currentSlide: 2,
      currentStep: 1,
    });
  }),
);

test(
  "the teacher cannot read a deleted session",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);
    const response = yield* request(url, "GET", `/api/admin/sessions/${deleted}`, { cookie });

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "a new session goes at the end, disabled, on slide 1, step 1",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);
    const before = yield* teacherList(url);

    const response = yield* request(url, "POST", "/api/admin/sessions", {
      cookie,
      body: { title: "Nueva", summary: "Recién creada" },
    });

    expect(response.status).toBe(201);

    const created = yield* bodyOf(Session, response);

    expect(created).toMatchObject({
      title: "Nueva",
      summary: "Recién creada",
      enabled: false,
      currentSlide: 1,
      currentStep: 1,
    });
    expect(created.position).toBe(Math.max(...positions(before)) + 1);
    expect((yield* teacherList(url)).at(-1)?.id).toBe(created.id);
  }),
);

test(
  "editing the title and the summary shows in both lists",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* patch(url, toEdit, { title: "Editada", summary: "El resumen nuevo" });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Session, response)).toMatchObject({
      title: "Editada",
      summary: "El resumen nuevo",
    });

    const edited = { id: toEdit, title: "Editada", summary: "El resumen nuevo" };

    expect(yield* studentList(url)).toContainEqual(expect.objectContaining(edited));
    expect(yield* teacherList(url)).toContainEqual(expect.objectContaining(edited));
  }),
);

test(
  "disabling a session hides it from the student and keeps its polls, hands and position",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, featured, yield* cookieFor(student));
      const cookie = yield* cookieFor(student);

      expect((yield* patch(url, featured, { enabled: false })).status).toBe(200);

      const hidden = yield* request(url, "GET", `/api/sessions/${featured}`, { cookie });

      expect(hidden.status).toBe(404);
      expect((yield* patch(url, featured, { enabled: true })).status).toBe(200);

      const session = yield* request(url, "GET", `/api/sessions/${featured}`, { cookie });

      expect(yield* bodyOf(Session, session)).toMatchObject({ currentSlide: 4, currentStep: 2 });

      const polls = yield* request(url, "GET", `/api/polls?sessionId=${featured}&status=active`, {
        cookie,
      });

      expect((yield* bodyOf(Schema.Array(Poll), polls)).map((poll) => poll.id)).toEqual([
        "01SSPA00000000000000000000",
      ]);

      const hands = yield* request(url, "GET", `/api/raised-hands?sessionId=${featured}`, {
        cookie,
      });

      expect(yield* bodyOf(Schema.Array(RaisedHandSummary), hands)).toEqual([
        { sessionId: featured, userId: student },
      ]);

      yield* socket.waitFor(isChanged("session"));
    }),
  ),
);

test(
  "enabling a session shows it to the student, as the featured one when it is the last",
  Effect.gen(function* () {
    const { url } = yield* stack;

    expect((yield* patch(url, toEnable, { enabled: true })).status).toBe(200);

    const sessions = yield* studentList(url);

    expect(sessions.map((session) => session.id)).toContain(toEnable);
    expect(sessions.at(-1)?.id).toBe(toEnable);
  }),
);

test(
  "moving the slide answers the session with the new position",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, toMove, yield* cookieFor(teacher));
      const response = yield* patch(url, toMove, { currentSlide: 5, currentStep: 3 });

      expect(response.status).toBe(200);
      expect(yield* bodyOf(Session, response)).toMatchObject({ currentSlide: 5, currentStep: 3 });

      yield* socket.waitFor(isChanged("slide"));
    }),
  ),
);

test(
  "a slide or a step of 0 is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;

    expect((yield* patch(url, zeroPosition, { currentSlide: 0, currentStep: 1 })).status).toBe(400);
    expect((yield* patch(url, zeroPosition, { currentSlide: 1, currentStep: 0 })).status).toBe(400);

    const cookie = yield* cookieFor(teacher);
    const session = yield* request(url, "GET", `/api/admin/sessions/${zeroPosition}`, { cookie });

    expect(yield* bodyOf(Session, session)).toMatchObject({ currentSlide: 2, currentStep: 2 });
  }),
);

test(
  "deleting a disabled session takes it out of the list and its detail",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);
    const response = yield* request(url, "DELETE", `/api/admin/sessions/${toDelete}`, { cookie });

    expect(response.status).toBe(204);
    expect((yield* teacherList(url)).map((session) => session.id)).not.toContain(toDelete);

    const detail = yield* request(url, "GET", `/api/admin/sessions/${toDelete}`, { cookie });

    expect(detail.status).toBe(404);
  }),
);

test(
  "deleting an enabled session answers SessionEnabled and changes nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);
    const response = yield* request(url, "DELETE", `/api/admin/sessions/${enabled}`, { cookie });

    expect(response.status).toBe(409);
    expect(failedWith(response, SessionEnabled)).toBe(true);
    expect((yield* studentList(url)).map((session) => session.id)).toContain(enabled);
  }),
);
