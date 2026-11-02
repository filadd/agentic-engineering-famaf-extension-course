import { expect } from "@effect/vitest";
import {
  InvalidPollContent,
  InvalidResponse,
  InvalidTransition,
  NotFeatured,
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
import { ChangelogEntry } from "@kurasu/contract/changelog";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { isChanged, openClassroom } from "./helpers/classroom.ts";
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
const bigCloud = "01PSD000000000000000000000";
const featuredSession = "01PSF000000000000000000000";
const beto = "01PVTB00000000000000000000";

const activeUnvoted = "01PQ1000000000000000000000";
const activeVoted = "01PQ2000000000000000000000";
const closedUnvoted = "01PQ3000000000000000000000";
const closedVoted = "01PQ4000000000000000000000";
const draft = "01PQ5000000000000000000000";
const deletedPoll = "01PQ6000000000000000000000";
const ofDisabled = "01PQ7000000000000000000000";

const feedback = (n: number) => `01PF${String(n).padStart(2, "0")}`.padEnd(26, "0");

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
  "a word cloud counts each word once per student and lists every word, the most sent first",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const [cloud] = yield* studentPolls(url, reader, `?sessionId=${bigCloud}&status=closed`);
    const words = cloud?.results?.words ?? [];

    expect(cloud?.results?.count).toBe(12);
    expect(words).toHaveLength(107);
    expect(words.slice(0, 2)).toEqual([
      { word: "todos", count: 12 },
      { word: "dos", count: 2 },
    ]);
    expect(words.slice(2).every((word) => word.count === 1)).toBe(true);
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
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, featuredSession, yield* cookieFor(teacher));
      const response = yield* vote(url, voter, "01PV1000000000000000000000", { choice: 1 });

      expect(response.status).toBe(200);
      expect(yield* bodyOf(Poll, response)).toMatchObject({
        myResponse: { choice: 1 },
        results: { count: 1, choice: [0, 1, 0] },
      });

      yield* socket.waitFor(isChanged("polls"));
    }),
  ),
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
    const closed = yield* vote(url, voter, "01PV7000000000000000000000", { choice: 0 });
    const drafted = yield* vote(url, voter, "01PV8000000000000000000000", { choice: 0 });

    expect(closed.status).toBe(409);
    expect(failedWith(closed, PollNotActive)).toBe(true);
    expect(drafted.status).toBe(409);
    expect(failedWith(drafted, PollNotActive)).toBe(true);
  }),
);

test(
  "voting on a poll of a session that is not the featured one answers PollNotFound and stores nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, voter, activeUnvoted, { choice: 0 });

    expect(response.status).toBe(404);
    expect(failedWith(response, PollNotFound)).toBe(true);
    expect(
      byId(yield* studentPolls(url, voter, `?sessionId=${withPolls}`), activeUnvoted)?.myResponse,
    ).toBeNull();
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
    expect(JSON.stringify(response.body)).not.toContain("responses");
    expect(JSON.stringify(response.body)).not.toContain(reader);
  }),
);

test(
  "a new choice poll with three options is a draft",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, teachers, yield* cookieFor(teacher));

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
      expect(JSON.stringify(response.body)).not.toContain("responses");

      expect(yield* socket.quietFor(isChanged("polls"))).toBe(true);
    }),
  ),
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

const teacherPolls = Effect.gen(function* () {
  const { url } = yield* stack;
  const cookie = yield* cookieFor(teacher);

  const response = yield* request(url, "GET", `/api/admin/polls?sessionId=${teachers}`, {
    cookie,
  });

  return yield* bodyOf(AdminPolls, response);
});

test(
  "options outside a choice poll, or labels outside a scale, answer InvalidPollContent",
  Effect.gen(function* () {
    const before = yield* teacherPolls;

    const contents: ReadonlyArray<
      Pick<PollDraft, "type" | "options" | "scaleMinLabel" | "scaleMaxLabel">
    > = [
      { type: "scale", options: ["A", "B"] },
      { type: "words", options: ["A", "B"] },
      { type: "choice", options: ["A", "B"], scaleMinLabel: "Nada" },
      { type: "words", scaleMaxLabel: "Mucho" },
    ];

    for (const content of contents) {
      const response = yield* asTeacher("POST", "/api/admin/polls", {
        sessionId: teachers,
        prompt: "Mal armada",
        ...content,
      });

      expect(response.status).toBe(400);
      expect(failedWith(response, InvalidPollContent)).toBe(true);
    }

    expect(yield* teacherPolls).toEqual(before);
  }),
);

test(
  "options on a scale draft answer InvalidPollContent and leave the draft as it was",
  Effect.gen(function* () {
    const id = "01PD8000000000000000000000";
    const before = (yield* teacherPolls).find((poll) => poll.id === id);

    const response = yield* asTeacher("PATCH", `/api/admin/polls/${id}`, {
      prompt: "Cambiada",
      options: ["Uno", "Dos"],
    });

    expect(response.status).toBe(400);
    expect(failedWith(response, InvalidPollContent)).toBe(true);
    expect(before).toMatchObject({ prompt: "Escala sin opciones", status: "draft" });
    expect((yield* teacherPolls).find((poll) => poll.id === id)).toEqual(before);
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
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, featuredSession, yield* cookieFor(teacher));
      const id = "01PD3000000000000000000000";
      const response = yield* asTeacher("PATCH", `/api/admin/polls/${id}`, { status: "active" });

      expect(response.status).toBe(200);
      expect(yield* bodyOf(AdminPoll, response)).toMatchObject({ status: "active" });
      expect(ids(yield* studentPolls(url, reader, "?status=active"))).toContain(id);

      yield* socket.waitFor(isChanged("polls"));
    }),
  ),
);

test(
  "activating a draft of a session that is not the featured one answers NotFeatured and leaves it a draft",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const id = "01PD9000000000000000000000";
    const response = yield* asTeacher("PATCH", `/api/admin/polls/${id}`, { status: "active" });

    expect(response.status).toBe(409);
    expect(failedWith(response, NotFeatured)).toBe(true);
    expect(ids(yield* studentPolls(url, reader, "?status=active"))).not.toContain(id);
    expect((yield* teacherPolls).find((poll) => poll.id === id)).toMatchObject({ status: "draft" });
  }),
);

test(
  "closing an active poll of a session that is not the featured one answers it closed",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, teachers, yield* cookieFor(teacher));

      const response = yield* asTeacher("PATCH", "/api/admin/polls/01PD4000000000000000000000", {
        status: "closed",
      });

      expect(response.status).toBe(200);
      expect(yield* bodyOf(AdminPoll, response)).toMatchObject({ status: "closed" });

      yield* socket.waitFor(isChanged("polls"));
    }),
  ),
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
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, teachers, yield* cookieFor(teacher));
      const id = "01PD7000000000000000000000";
      const response = yield* asTeacher("DELETE", `/api/admin/polls/${id}`);

      expect(response.status).toBe(204);
      expect(ids(yield* studentPolls(url, reader, ""))).not.toContain(id);

      yield* socket.waitFor(isChanged("polls"));
    }),
  ),
);

const answers = (url: string, userId: string, id: string) =>
  Effect.gen(function* () {
    const polls = yield* studentPolls(url, userId, `?sessionId=${featuredSession}`);

    return byId(polls, id)?.myResponse ?? null;
  });

const feedbackOfTeacher = (id: string) =>
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* request(url, "GET", `/api/admin/polls?sessionId=${featuredSession}`, {
      cookie,
    });

    expect(response.status).toBe(200);

    const poll = (yield* bodyOf(AdminPolls, response)).find((entry) => entry.id === id);

    return poll ?? (yield* Effect.die(`the teacher's list lacks the poll ${id}`));
  });

const sessionEntries = Effect.gen(function* () {
  const cookie = yield* cookieFor(teacher);
  const { url } = yield* stack;

  const response = yield* request(url, "GET", `/api/admin/changelog?sessionId=${featuredSession}`, {
    cookie,
  });

  return yield* bodyOf(Schema.Array(ChangelogEntry), response);
});

test(
  "a feedback answer keeps the text as written, shows no results and keeps the opened news",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, featuredSession, yield* cookieFor(teacher));

      expect((yield* sessionEntries).map((entry) => entry.entityId)).toContain(feedback(1));

      const response = yield* vote(url, voter, feedback(1), { pick: 4, text: "  Me sirvió  " });

      expect(response.status).toBe(200);
      expect(yield* bodyOf(Poll, response)).toMatchObject({
        myResponse: { pick: 4, text: "  Me sirvió  " },
        results: null,
      });
      expect((yield* sessionEntries).map((entry) => entry.entityId)).toContain(feedback(1));

      yield* socket.waitFor(isChanged("polls"));
    }),
  ),
);

test(
  "a feedback answer with an empty text is rejected and stores nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;

    expect((yield* vote(url, voter, feedback(2), { pick: 1, text: "" })).status).toBe(400);
    expect(yield* answers(url, voter, feedback(2))).toBeNull();
  }),
);

test(
  "a feedback answer without text keeps only the pick",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, voter, feedback(3), { pick: 5 });

    expect(response.status).toBe(200);
    expect((yield* bodyOf(Poll, response)).myResponse).toEqual({ pick: 5 });
  }),
);

test(
  "a feedback answer with a text of only spaces is rejected and stores nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;

    expect((yield* vote(url, voter, feedback(2), { pick: 3, text: "     " })).status).toBe(400);
    expect(yield* answers(url, voter, feedback(2))).toBeNull();
  }),
);

test(
  "a feedback answer with a text of only line breaks is rejected and stores nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;

    expect((yield* vote(url, voter, feedback(2), { pick: 3, text: "\n\r\n\n" })).status).toBe(400);
    expect(yield* answers(url, voter, feedback(2))).toBeNull();
  }),
);

test(
  "a feedback text of 5000 characters is stored whole",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const text = "a".repeat(5000);
    const response = yield* vote(url, voter, feedback(4), { pick: 3, text });

    expect(response.status).toBe(200);
    expect((yield* bodyOf(Poll, response)).myResponse).toEqual({ pick: 3, text });
  }),
);

test(
  "a feedback text with line breaks and emojis is stored as written",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const text = "Primera línea\n\nSegunda 🎉 línea 😀";
    const response = yield* vote(url, voter, feedback(5), { pick: 2, text });

    expect(response.status).toBe(200);
    expect((yield* bodyOf(Poll, response)).myResponse).toEqual({ pick: 2, text });
  }),
);

test(
  "changing a feedback answer keeps one row for the student, in the same place",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const before = (yield* feedbackOfTeacher(feedback(6))).responses ?? [];

    const response = yield* vote(url, voter, feedback(6), {
      pick: 5,
      text: "Mejor de lo que creía",
    });

    expect(response.status).toBe(200);
    expect((yield* bodyOf(Poll, response)).myResponse).toEqual({
      pick: 5,
      text: "Mejor de lo que creía",
    });

    const after = (yield* feedbackOfTeacher(feedback(6))).responses ?? [];

    expect(after).toHaveLength(before.length);
    expect(after.map((entry) => entry.id)).toEqual(before.map((entry) => entry.id));
    expect(after[0]).toMatchObject({ user: { id: voter }, pick: 5, text: "Mejor de lo que creía" });
  }),
);

test(
  "a feedback pick of 0, 6 or 2.5 is rejected and stores nothing",
  Effect.gen(function* () {
    const { url } = yield* stack;

    for (const pick of [0, 6, 2.5]) {
      expect((yield* vote(url, voter, feedback(2), { pick, text: "Común" })).status).toBe(400);
    }

    expect(yield* answers(url, voter, feedback(2))).toBeNull();
  }),
);

test(
  "a choice answer to a feedback poll and a pick answer to a scale poll answer InvalidResponse",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const toFeedback = yield* vote(url, voter, feedback(2), { choice: 1 });
    const toScale = yield* vote(url, voter, "01PV5000000000000000000000", { pick: 3 });

    expect(toFeedback.status).toBe(400);
    expect(failedWith(toFeedback, InvalidResponse)).toBe(true);
    expect(toScale.status).toBe(400);
    expect(failedWith(toScale, InvalidResponse)).toBe(true);
  }),
);

test(
  "answering a closed feedback answers PollNotActive and keeps the saved answer",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* vote(url, voter, feedback(13), { pick: 1, text: "Tarde" });

    expect(response.status).toBe(409);
    expect(failedWith(response, PollNotActive)).toBe(true);
    expect(yield* answers(url, voter, feedback(13))).toEqual({ pick: 3, text: "Quedó" });
  }),
);

test(
  "the teacher lists a feedback with its one answer and who sent it",
  Effect.gen(function* () {
    const poll = yield* feedbackOfTeacher(feedback(9));

    expect(poll.results).toEqual({ count: 1, feedback: [0, 0, 0, 1, 0] });
    expect(poll.responses).toEqual([
      {
        id: "01PFR091000000000000000000",
        user: { id: voter, name: "Ana", avatar: "panda" },
        pick: 4,
        text: "Muy buena",
      },
    ]);
  }),
);

test(
  "the teacher lists feedback answers by response id, with a bar per pick and no text for the silent",
  Effect.gen(function* () {
    const poll = yield* feedbackOfTeacher(feedback(7));

    expect(poll.results).toEqual({ count: 3, feedback: [1, 0, 1, 0, 1] });
    expect(poll.responses?.map((entry) => entry.id)).toEqual([
      "01PFR071000000000000000000",
      "01PFR072000000000000000000",
      "01PFR073000000000000000000",
    ]);
    expect(poll.responses?.map((entry) => entry.user.name)).toEqual(["Lector", "Ana", "Beto"]);
    expect(poll.responses?.[1]).not.toHaveProperty("text");
  }),
);

test(
  "three feedback answers on the same pick make one bar and keep their own texts",
  Effect.gen(function* () {
    const poll = yield* feedbackOfTeacher(feedback(10));

    expect(poll.results).toEqual({ count: 3, feedback: [0, 0, 0, 3, 0] });
    expect(poll.responses?.map((entry) => entry.text)).toEqual(["Buena", "Clara", "Entretenida"]);
  }),
);

test(
  "a feedback without answers lists five zeros and no responses",
  Effect.gen(function* () {
    const poll = yield* feedbackOfTeacher(feedback(11));

    expect(poll.results).toEqual({ count: 0, feedback: [0, 0, 0, 0, 0] });
    expect(poll.responses).toEqual([]);
  }),
);

test(
  "the first student to answer a feedback stays first after changing their pick",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const before = yield* feedbackOfTeacher(feedback(8));

    expect((yield* vote(url, reader, feedback(8), { pick: 5 })).status).toBe(200);

    const after = yield* feedbackOfTeacher(feedback(8));

    expect(after.responses?.map((entry) => entry.user.id)).toEqual(
      before.responses?.map((entry) => entry.user.id),
    );
    expect(after.responses?.[0]).toMatchObject({ user: { id: reader }, pick: 5 });
    expect(before.results).toEqual({ count: 3, feedback: [1, 0, 1, 0, 1] });
    expect(after.results).toEqual({ count: 3, feedback: [0, 0, 1, 0, 2] });
  }),
);

test(
  "an answered active feedback comes to the student with their answer and no results",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const polls = yield* studentPolls(url, voter, `?sessionId=${featuredSession}&status=active`);

    expect(byId(polls, feedback(9))).toMatchObject({
      myResponse: { pick: 4, text: "Muy buena" },
      results: null,
    });
  }),
);

test(
  "a closed feedback the student did not answer comes with no answer and no results",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const polls = yield* studentPolls(url, voter, `?sessionId=${featuredSession}&status=closed`);

    expect(byId(polls, feedback(12))).toMatchObject({ myResponse: null, results: null });
    expect(byId(polls, feedback(13))).toMatchObject({
      myResponse: { pick: 3, text: "Quedó" },
      results: null,
    });
  }),
);

test(
  "a new feedback is a draft with five zeros and no responses",
  Effect.gen(function* () {
    const response = yield* asTeacher("POST", "/api/admin/polls", {
      sessionId: teachers,
      type: "feedback",
      prompt: "¿Cómo te fue hoy?",
    });

    expect(response.status).toBe(201);
    expect(yield* bodyOf(AdminPoll, response)).toMatchObject({
      type: "feedback",
      status: "draft",
      results: { count: 0, feedback: [0, 0, 0, 0, 0] },
      responses: [],
    });
  }),
);

test(
  "a feedback with options or scale labels answers InvalidPollContent and stores nothing",
  Effect.gen(function* () {
    const before = yield* teacherPolls;

    for (const content of [{ options: ["A", "B"] }, { scaleMinLabel: "Nada" }]) {
      const response = yield* asTeacher("POST", "/api/admin/polls", {
        sessionId: teachers,
        type: "feedback",
        prompt: "Mal armada",
        ...content,
      });

      expect(response.status).toBe(400);
      expect(failedWith(response, InvalidPollContent)).toBe(true);
    }

    expect(yield* teacherPolls).toEqual(before);
  }),
);

test(
  "activating a feedback draft shows it to the students with its opened news",
  Effect.gen(function* () {
    const { url } = yield* stack;

    const response = yield* asTeacher("PATCH", `/api/admin/polls/${feedback(14)}`, {
      status: "active",
    });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(AdminPoll, response)).toMatchObject({
      status: "active",
      results: { count: 0, feedback: [0, 0, 0, 0, 0] },
      responses: [],
    });
    expect(ids(yield* studentPolls(url, reader, "?status=active"))).toContain(feedback(14));
    expect((yield* sessionEntries).map((entry) => entry.entityId)).toContain(feedback(14));
  }),
);

test(
  "closing a feedback with answers keeps its bars and its list",
  Effect.scoped(
    Effect.gen(function* () {
      const { url } = yield* stack;
      const socket = yield* openClassroom(url, featuredSession, yield* cookieFor(teacher));

      const response = yield* asTeacher("PATCH", `/api/admin/polls/${feedback(15)}`, {
        status: "closed",
      });

      expect(response.status).toBe(200);

      const poll = yield* bodyOf(AdminPoll, response);

      expect(poll.status).toBe("closed");
      expect(poll.results).toEqual({ count: 2, feedback: [0, 1, 0, 0, 1] });
      expect(poll.responses?.map((entry) => entry.user.id)).toEqual([voter, beto]);

      yield* socket.waitFor(isChanged("polls"));
    }),
  ),
);
