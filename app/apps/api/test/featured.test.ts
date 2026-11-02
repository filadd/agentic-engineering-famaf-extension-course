import { expect } from "@effect/vitest";
import { ChangelogEntry } from "@kurasu/contract/changelog";
import { NotFeatured, SessionDisabled } from "@kurasu/contract/errors";
import { AdminPoll } from "@kurasu/contract/polls";
import { AdminQuestion } from "@kurasu/contract/questions";
import { RaisedHand } from "@kurasu/contract/raised-hands";
import { Session, type SessionChange, SessionSummary } from "@kurasu/contract/sessions";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { bodyOf, failedWith } from "./helpers/body.ts";
import { isChanged, openClassroom, upgradeStatus } from "./helpers/classroom.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "featured", allowedEmails: [] });

const teacher = "01FTCH00000000000000000000";
const ana = "01FSTA00000000000000000000";

const initial = "01FSA000000000000000000000";
const second = "01FSB000000000000000000000";
const third = "01FSC000000000000000000000";
const fourth = "01FSD000000000000000000000";

const fifth = "01FSF000000000000000000000";

const asTeacher = (method: "GET" | "PATCH", path: string, body?: SessionChange) =>
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    return yield* request(url, method, path, body == null ? { cookie } : { cookie, body });
  });

const patch = (id: string, body: SessionChange) =>
  asTeacher("PATCH", `/api/admin/sessions/${id}`, body);

const adminList = Effect.gen(function* () {
  const response = yield* asTeacher("GET", "/api/admin/sessions");

  return yield* bodyOf(Schema.Array(SessionSummary), response);
});

const studentList = Effect.gen(function* () {
  const { url } = yield* stack;
  const cookie = yield* cookieFor(ana);

  return yield* bodyOf(
    Schema.Array(SessionSummary),
    yield* request(url, "GET", "/api/sessions", { cookie }),
  );
});

const featuredIds = (sessions: ReadonlyArray<SessionSummary>) =>
  sessions.flatMap((session) => (session.featured ? [session.id] : []));

const summaryOf = (id: string) =>
  Effect.gen(function* () {
    const found = (yield* adminList).find((session) => session.id === id);

    return found ?? (yield* Effect.die(`the list lacks the session ${id}`));
  });

const pollsOf = (sessionId: string) =>
  Effect.gen(function* () {
    const response = yield* asTeacher("GET", `/api/admin/polls?sessionId=${sessionId}`);

    return yield* bodyOf(Schema.Array(AdminPoll), response);
  });

const activePollIds = (sessionId: string) =>
  Effect.map(pollsOf(sessionId), (polls) =>
    polls.filter((poll) => poll.status === "active").map((poll) => poll.id),
  );

const handsOf = (sessionId: string) =>
  Effect.gen(function* () {
    const response = yield* asTeacher("GET", `/api/admin/raised-hands?sessionId=${sessionId}`);

    return yield* bodyOf(Schema.Array(RaisedHand), response);
  });

const questionsOf = (sessionId: string) =>
  Effect.gen(function* () {
    const response = yield* asTeacher("GET", `/api/admin/questions?sessionId=${sessionId}`);

    return yield* bodyOf(Schema.Array(AdminQuestion), response);
  });

const entriesOf = (sessionId: string) =>
  Effect.gen(function* () {
    const response = yield* asTeacher("GET", `/api/admin/changelog?sessionId=${sessionId}`);

    return yield* bodyOf(Schema.Array(ChangelogEntry), response);
  });

const entryTypes = (sessionId: string) =>
  Effect.map(entriesOf(sessionId), (entries) => entries.map((entry) => entry.type));

test(
  "featuring a session when another one is featured moves the mark, closes the other's polls, lowers its hands and turns its questions off",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, initial, yield* cookieFor(teacher));

      expect(featuredIds(yield* adminList)).toEqual([initial]);

      const response = yield* patch(second, { featured: true });

      expect(response.status).toBe(200);
      expect(yield* bodyOf(Session, response)).toMatchObject({ id: second, featured: true });
      expect(featuredIds(yield* studentList)).toEqual([second]);
      expect(featuredIds(yield* adminList)).toEqual([second]);
      expect(yield* summaryOf(initial)).toMatchObject({
        featured: false,
        featuredQuestions: false,
      });

      const polls = yield* pollsOf(initial);

      expect(polls.map((poll) => poll.status)).toEqual(["closed", "closed", "closed"]);
      expect(yield* handsOf(initial)).toEqual([]);
      expect((yield* questionsOf(initial)).map((question) => question.id)).toEqual([
        "01FQ1000000000000000000000",
      ]);
      expect(yield* entryTypes(initial)).toEqual([]);
      expect(yield* activePollIds(second)).toHaveLength(2);

      yield* socket.waitFor(isChanged("session"));
      yield* socket.waitFor(isChanged("polls"));
      yield* socket.waitFor(isChanged("hands"));
    }),
  ),
);

test(
  "featuring the session that is already featured changes nothing",
  Effect.gen(function* () {
    const response = yield* patch(second, { featured: true });

    expect(response.status).toBe(200);
    expect(featuredIds(yield* adminList)).toEqual([second]);
    expect(yield* activePollIds(second)).toHaveLength(2);
    expect(yield* handsOf(second)).toHaveLength(1);
  }),
);

test(
  "turning the featured questions on records that they opened, with the session title",
  Effect.gen(function* () {
    const response = yield* patch(second, { featuredQuestions: true });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Session, response)).toMatchObject({ featuredQuestions: true });
    expect(
      (yield* entriesOf(second)).filter((entry) => entry.type === "questions-opened"),
    ).toMatchObject([{ entityId: second, name: "Segunda" }]);
  }),
);

test(
  "turning the featured questions off drops the entry that they opened",
  Effect.gen(function* () {
    const response = yield* patch(second, { featuredQuestions: false });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Session, response)).toMatchObject({ featuredQuestions: false });
    expect(yield* entryTypes(second)).not.toContain("questions-opened");
  }),
);

test(
  "turning the featured questions on in a session that is not featured answers NotFeatured and stores nothing",
  Effect.gen(function* () {
    const response = yield* patch(third, { featuredQuestions: true });

    expect(response.status).toBe(409);
    expect(failedWith(response, NotFeatured)).toBe(true);
    expect((yield* summaryOf(third)).featuredQuestions).toBe(false);
    expect(yield* entryTypes(third)).not.toContain("questions-opened");
  }),
);

test(
  "featuring a disabled session without enabling it answers SessionDisabled and changes nothing",
  Effect.gen(function* () {
    const response = yield* patch(fourth, { featured: true });

    expect(response.status).toBe(409);
    expect(failedWith(response, SessionDisabled)).toBe(true);
    expect(featuredIds(yield* adminList)).toEqual([second]);
    expect(yield* activePollIds(second)).toHaveLength(2);
  }),
);

test(
  "enabling a session while featuring it enables and features it in one request, and the previous one leaves",
  Effect.gen(function* () {
    expect((yield* patch(second, { featuredQuestions: true })).status).toBe(200);

    const response = yield* patch(fifth, { enabled: true, featured: true });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Session, response)).toMatchObject({
      id: fifth,
      enabled: true,
      featured: true,
    });
    expect(featuredIds(yield* adminList)).toEqual([fifth]);
    expect(yield* summaryOf(second)).toMatchObject({ featured: false, featuredQuestions: false });
    expect(yield* activePollIds(second)).toEqual([]);
    expect(yield* handsOf(second)).toEqual([]);
    expect(yield* entryTypes(second)).toEqual([]);
    expect(yield* entryTypes(fifth)).toEqual(["session-enabled"]);
  }),
);

test(
  "removing the mark leaves no featured session, closes its polls, lowers its hands and turns its questions off, and nobody enters a classroom",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, fifth, yield* cookieFor(teacher));

      expect((yield* patch(fifth, { featuredQuestions: true })).status).toBe(200);

      const response = yield* patch(fifth, { featured: false });

      expect(response.status).toBe(200);
      expect(yield* bodyOf(Session, response)).toMatchObject({
        enabled: true,
        featured: false,
        featuredQuestions: false,
      });
      expect(featuredIds(yield* adminList)).toEqual([]);
      expect(featuredIds(yield* studentList)).toEqual([]);
      expect(yield* activePollIds(fifth)).toEqual([]);
      expect(yield* handsOf(fifth)).toEqual([]);
      expect(yield* entryTypes(fifth)).not.toContain("questions-opened");
      expect(yield* upgradeStatus(url, fifth, yield* cookieFor(ana))).toBe(404);
      expect(yield* upgradeStatus(url, second, yield* cookieFor(ana))).toBe(404);

      yield* socket.waitFor(isChanged("session"));
    }),
  ),
);

test(
  "featuring an enabled session when none is featured marks it and records nothing",
  Effect.gen(function* () {
    const before = yield* entriesOf(third);
    const response = yield* patch(third, { featured: true });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Session, response)).toMatchObject({ id: third, featured: true });
    expect(featuredIds(yield* studentList)).toEqual([third]);
    expect(featuredIds(yield* adminList)).toEqual([third]);
    expect(yield* entriesOf(third)).toEqual(before);
  }),
);

test(
  "disabling the featured session removes the mark, closes its polls, lowers its hands and drops that it was enabled",
  Effect.gen(function* () {
    expect(yield* entryTypes(third)).toContain("session-enabled");

    const response = yield* patch(third, { enabled: false });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Session, response)).toMatchObject({ enabled: false, featured: false });
    expect(featuredIds(yield* adminList)).toEqual([]);
    expect(yield* activePollIds(third)).toEqual([]);
    expect(yield* handsOf(third)).toEqual([]);
    expect(yield* entryTypes(third)).not.toContain("session-enabled");
  }),
);
