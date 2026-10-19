import { expect } from "@effect/vitest";
import {
  InvalidResponse,
  InvalidTransition,
  NotStudent,
  PollNotActive,
  PollNotDraft,
  PollNotFound,
  SessionNotFound,
} from "@kurasu/contract/errors";
import {
  AdminPoll,
  Poll,
  type PollChange,
  type PollDraft,
  type ResponseValue,
} from "@kurasu/contract/polls";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { bodyOf, failedWith } from "./helpers/body.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "polls", allowedEmails: [] });

const teacher = "01PTCH00000000000000000000";
const reader = "01PRDR00000000000000000000";
const voter = "01PVTA00000000000000000000";

const withPolls = "01PSA000000000000000000000";
const disabled = "01PSB000000000000000000000";
const teachers = "01PSC000000000000000000000";

const activeUnvoted = "01PQ1000000000000000000000";
const activeVoted = "01PQ2000000000000000000000";
const closedUnvoted = "01PQ3000000000000000000000";
const closedVoted = "01PQ4000000000000000000000";
const draft = "01PQ5000000000000000000000";
const deletedPoll = "01PQ6000000000000000000000";
const ofDisabled = "01PQ7000000000000000000000";

const Polls = Schema.Array(Poll);
const AdminPolls = Schema.Array(AdminPoll);

const studentPolls = (url: string, userId: string, query: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(userId);
    const response = yield* request(url, "GET", `/api/polls${query}`, { cookie });

    expect(response.status).toBe(200);

    return yield* bodyOf(Polls, response);
  });

const ids = (polls: ReadonlyArray<Poll | AdminPoll>) => polls.map((poll) => poll.id);

const byId = (polls: ReadonlyArray<Poll>, id: string) => polls.find((poll) => poll.id === id);

const vote = (url: string, userId: string, id: string, myResponse: ResponseValue) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(userId);

    return yield* request(url, "PATCH", `/api/polls/${id}`, { cookie, body: { myResponse } });
  });

const asTeacher = (
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  body?: PollDraft | PollChange,
) =>
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    return yield* request(url, method, path, body == null ? { cookie } : { cookie, body });
  });

test(
  "the student's active polls come from visible sessions, with results only once voted",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const polls = yield* studentPolls(url, reader, "?status=active");

    expect(ids(polls)).toEqual(expect.arrayContaining([activeUnvoted, activeVoted]));
    expect(ids(polls)).not.toEqual(
      expect.arrayContaining([closedUnvoted, closedVoted, draft, deletedPoll, ofDisabled]),
    );
    expect(polls.every((poll) => poll.status === "active")).toBe(true);
    expect(byId(polls, activeUnvoted)).toMatchObject({ myResponse: null, results: null });
    expect(byId(polls, activeVoted)).toMatchObject({
      myResponse: { scale: 4 },
      results: { count: 1, scale: [0, 0, 0, 1, 0] },
    });
  }),
);

test(
  "the closed polls of a session come with their results and the student's vote or null",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const polls = yield* studentPolls(url, reader, `?sessionId=${withPolls}&status=closed`);

    expect(ids(polls).toSorted()).toEqual([closedUnvoted, closedVoted].toSorted());
    expect(byId(polls, closedUnvoted)).toMatchObject({
      myResponse: null,
      results: { count: 1, choice: [0, 1] },
    });
    expect(byId(polls, closedVoted)).toMatchObject({
      myResponse: { words: ["hola"] },
      results: { count: 1, words: [{ word: "hola", count: 1 }] },
    });
  }),
);

test(
  "without filters the student gets active and closed polls, never drafts or deleted ones",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const polls = yield* studentPolls(url, reader, "");

    expect(ids(polls)).toEqual(
      expect.arrayContaining([activeUnvoted, activeVoted, closedUnvoted, closedVoted]),
    );

    for (const hidden of [draft, deletedPoll, ofDisabled]) {
      expect(ids(polls)).not.toContain(hidden);
    }
  }),
);

test(
  "the polls of a disabled session answer SessionNotFound",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(reader);

    const response = yield* request(url, "GET", `/api/polls?sessionId=${disabled}&status=closed`, {
      cookie,
    });

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "voting on a choice poll answers the poll with the vote and its results",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, voter, "01PV1000000000000000000000", { choice: 1 });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Poll, response)).toMatchObject({
      myResponse: { choice: 1 },
      results: { count: 1, choice: [0, 1, 0] },
    });
  }),
);

test(
  "changing a scale vote counts only the new one",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, voter, "01PV2000000000000000000000", { scale: 5 });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Poll, response)).toMatchObject({
      myResponse: { scale: 5 },
      results: { count: 1, scale: [0, 0, 0, 0, 1] },
    });
  }),
);

test(
  "adding words to a word cloud sends the whole list and still counts one vote",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* vote(url, voter, "01PV3000000000000000000000", {
      words: ["uno", "dos", "tres"],
    });

    expect(response.status).toBe(200);

    const poll = yield* bodyOf(Poll, response);

    expect(poll.myResponse).toEqual({ words: ["uno", "dos", "tres"] });
    expect(poll.results?.count).toBe(1);
    expect(poll.results?.words?.map((entry) => entry.word).toSorted()).toEqual([
      "dos",
      "tres",
      "uno",
    ]);
  }),
);

test(
  "a choice outside the options answers InvalidResponse",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, voter, "01PV4000000000000000000000", { choice: 3 });

    expect(response.status).toBe(400);
    expect(failedWith(response, InvalidResponse)).toBe(true);
  }),
);

test(
  "a scale vote of 6 is rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, voter, "01PV5000000000000000000000", { scale: 6 });

    expect(response.status).toBe(400);
  }),
);

test(
  "eleven words, or a word of 31 letters, are rejected",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const poll = "01PV6000000000000000000000";

    const eleven = Array.from({ length: 11 }, (_, index) => `palabra${index}`);

    expect((yield* vote(url, voter, poll, { words: eleven })).status).toBe(400);
    expect((yield* vote(url, voter, poll, { words: ["a".repeat(31)] })).status).toBe(400);
  }),
);

test(
  "a scale answer to a choice poll answers InvalidResponse",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, voter, "01PV4000000000000000000000", { scale: 3 });

    expect(response.status).toBe(400);
    expect(failedWith(response, InvalidResponse)).toBe(true);
  }),
);

test(
  "voting on a closed poll or a draft answers PollNotActive",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const closed = yield* vote(url, voter, closedUnvoted, { choice: 0 });
    const drafted = yield* vote(url, voter, draft, { choice: 0 });

    expect(closed.status).toBe(409);
    expect(failedWith(closed, PollNotActive)).toBe(true);
    expect(drafted.status).toBe(409);
    expect(failedWith(drafted, PollNotActive)).toBe(true);
  }),
);

test(
  "voting on a deleted poll or one of a disabled session answers PollNotFound",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const removed = yield* vote(url, voter, deletedPoll, { words: ["hola"] });
    const hidden = yield* vote(url, voter, ofDisabled, { choice: 0 });

    expect(removed.status).toBe(404);
    expect(failedWith(removed, PollNotFound)).toBe(true);
    expect(hidden.status).toBe(404);
    expect(failedWith(hidden, PollNotFound)).toBe(true);
  }),
);

test(
  "the teacher does not vote",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, teacher, "01PV1000000000000000000000", { choice: 0 });

    expect(response.status).toBe(403);
    expect(failedWith(response, NotStudent)).toBe(true);
  }),
);

test(
  "the teacher lists every poll not deleted, drafts included, with aggregated results",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* request(url, "GET", `/api/admin/polls?sessionId=${withPolls}`, {
      cookie,
    });

    expect(response.status).toBe(200);

    const polls = yield* bodyOf(AdminPolls, response);

    expect(ids(polls)).toEqual(expect.arrayContaining([draft, closedUnvoted, activeVoted]));
    expect(ids(polls)).not.toContain(deletedPoll);
    expect(polls.find((poll) => poll.id === closedUnvoted)?.results).toEqual({
      count: 1,
      choice: [0, 1],
    });
    expect(polls.find((poll) => poll.id === draft)).toMatchObject({
      status: "draft",
      results: { count: 0 },
    });
    expect(JSON.stringify(response.body)).not.toContain("myResponse");
    expect(JSON.stringify(response.body)).not.toContain(reader);
  }),
);

test(
  "a new choice poll with three options is a draft",
  Effect.gen(function* () {
    const response = yield* asTeacher("POST", "/api/admin/polls", {
      sessionId: teachers,
      type: "choice",
      prompt: "¿Cuál?",
      options: ["A", "B", "C"],
    });

    expect(response.status).toBe(201);
    expect(yield* bodyOf(AdminPoll, response)).toMatchObject({
      status: "draft",
      options: ["A", "B", "C"],
      results: { count: 0, choice: [0, 0, 0] },
    });
  }),
);

test(
  "a new word cloud is a draft",
  Effect.gen(function* () {
    const response = yield* asTeacher("POST", "/api/admin/polls", {
      sessionId: teachers,
      type: "words",
      prompt: "Una palabra",
    });

    expect(response.status).toBe(201);
    expect(yield* bodyOf(AdminPoll, response)).toMatchObject({ type: "words", status: "draft" });
  }),
);

test(
  "a new scale keeps the labels of its ends",
  Effect.gen(function* () {
    const response = yield* asTeacher("POST", "/api/admin/polls", {
      sessionId: teachers,
      type: "scale",
      prompt: "¿Cuánto?",
      scaleMinLabel: "Nada",
      scaleMaxLabel: "Mucho",
    });

    expect(response.status).toBe(201);
    expect(yield* bodyOf(AdminPoll, response)).toMatchObject({
      status: "draft",
      scaleMinLabel: "Nada",
      scaleMaxLabel: "Mucho",
    });
  }),
);

const createChoice = (options: ReadonlyArray<string>) =>
  asTeacher("POST", "/api/admin/polls", {
    sessionId: teachers,
    type: "choice",
    prompt: "¿Cuál?",
    options,
  });

test(
  "a choice poll with one or eleven options is rejected",
  Effect.gen(function* () {
    expect((yield* createChoice(["Solo una"])).status).toBe(400);
    expect((yield* createChoice(Array.from({ length: 11 }, (_, index) => `${index}`))).status).toBe(
      400,
    );
  }),
);

test(
  "editing a draft answers it with the new content",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", "/api/admin/polls/01PD1000000000000000000000", {
      prompt: "Editada",
      options: ["Uno", "Dos", "Tres"],
    });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(AdminPoll, response)).toMatchObject({
      prompt: "Editada",
      options: ["Uno", "Dos", "Tres"],
      status: "draft",
    });
  }),
);

test(
  "editing an active poll answers PollNotDraft",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", "/api/admin/polls/01PD2000000000000000000000", {
      prompt: "No se edita",
    });

    expect(response.status).toBe(409);
    expect(failedWith(response, PollNotDraft)).toBe(true);
  }),
);

test(
  "activating a draft shows it to the students",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const id = "01PD3000000000000000000000";
    const response = yield* asTeacher("PATCH", `/api/admin/polls/${id}`, { status: "active" });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(AdminPoll, response)).toMatchObject({ status: "active" });
    expect(ids(yield* studentPolls(url, reader, "?status=active"))).toContain(id);
  }),
);

test(
  "closing an active poll answers it closed",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", "/api/admin/polls/01PD4000000000000000000000", {
      status: "closed",
    });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(AdminPoll, response)).toMatchObject({ status: "closed" });
  }),
);

test(
  "a closed poll does not open again",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", "/api/admin/polls/01PD5000000000000000000000", {
      status: "active",
    });

    expect(response.status).toBe(409);
    expect(failedWith(response, InvalidTransition)).toBe(true);
  }),
);

test(
  "a draft does not close",
  Effect.gen(function* () {
    const response = yield* asTeacher("PATCH", "/api/admin/polls/01PD6000000000000000000000", {
      status: "closed",
    });

    expect(response.status).toBe(409);
    expect(failedWith(response, InvalidTransition)).toBe(true);
  }),
);

test(
  "deleting an active poll hides it from the students",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const id = "01PD7000000000000000000000";
    const response = yield* asTeacher("DELETE", `/api/admin/polls/${id}`);

    expect(response.status).toBe(204);
    expect(ids(yield* studentPolls(url, reader, ""))).not.toContain(id);
  }),
);
