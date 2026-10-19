import { expect } from "@effect/vitest";
import { NotAuthor, OwnQuestion, QuestionNotFound, SessionNotFound } from "@kurasu/contract/errors";
import { AdminQuestion, Question } from "@kurasu/contract/questions";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { bodyOf, failedWith } from "./helpers/body.ts";
import { request } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "questions", allowedEmails: [] });

const teacher = "01QTCH00000000000000000000";
const ana = "01QSTA00000000000000000000";

const actions = "01QSA000000000000000000000";
const disabled = "01QSB000000000000000000000";
const listed = "01QSC000000000000000000000";
const teachers = "01QSD000000000000000000000";

const studentQuestions = (url: string, sessionId: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(ana);

    const response = yield* request(url, "GET", `/api/questions?sessionId=${sessionId}`, {
      cookie,
    });

    expect(response.status).toBe(200);

    return yield* bodyOf(Schema.Array(Question), response);
  });

interface NewQuestion {
  readonly sessionId: string;
  readonly body: string;
}

interface QuestionVote {
  readonly myVote: boolean;
}

const asAna = (
  method: "POST" | "PATCH" | "DELETE",
  path: string,
  body?: NewQuestion | QuestionVote,
) =>
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(ana);

    return yield* request(url, method, path, body == null ? { cookie } : { cookie, body });
  });

const answer = (url: string, id: string, answered: boolean) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(teacher);

    return yield* request(url, "PATCH", `/api/admin/questions/${id}`, {
      cookie,
      body: { answered },
    });
  });

test(
  "the student sees the open questions by votes, without author, marking their own and their votes",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(ana);
    const response = yield* request(url, "GET", `/api/questions?sessionId=${listed}`, { cookie });

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).not.toContain("author");
    expect(yield* bodyOf(Schema.Array(Question), response)).toEqual([
      {
        id: "01QQ2000000000000000000000",
        sessionId: listed,
        body: "¿La más votada?",
        votes: 2,
        myVote: true,
        mine: false,
      },
      {
        id: "01QQ3000000000000000000000",
        sessionId: listed,
        body: "¿La del medio?",
        votes: 1,
        myVote: false,
        mine: false,
      },
      {
        id: "01QQ1000000000000000000000",
        sessionId: listed,
        body: "¿La propia?",
        votes: 0,
        myVote: false,
        mine: true,
      },
    ]);
  }),
);

test(
  "the questions of a disabled session answer SessionNotFound",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(ana);
    const response = yield* request(url, "GET", `/api/questions?sessionId=${disabled}`, { cookie });

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "asking answers the question as the student's own, with no votes",
  Effect.gen(function* () {
    const response = yield* asAna("POST", "/api/questions", {
      sessionId: actions,
      body: "¿Cómo se usa un agente?",
    });

    expect(response.status).toBe(201);
    expect(yield* bodyOf(Question, response)).toMatchObject({
      sessionId: actions,
      body: "¿Cómo se usa un agente?",
      votes: 0,
      myVote: false,
      mine: true,
    });
  }),
);

test(
  "an empty question is rejected",
  Effect.gen(function* () {
    const response = yield* asAna("POST", "/api/questions", { sessionId: actions, body: "" });

    expect(response.status).toBe(400);
  }),
);

test(
  "asking in a disabled session answers SessionNotFound",
  Effect.gen(function* () {
    const response = yield* asAna("POST", "/api/questions", {
      sessionId: disabled,
      body: "¿Hay alguien?",
    });

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "voting someone else's question adds one vote, and voting again adds none",
  Effect.gen(function* () {
    const path = "/api/questions/01QV5000000000000000000000";
    const first = yield* asAna("PATCH", path, { myVote: true });

    expect(first.status).toBe(200);
    expect(yield* bodyOf(Question, first)).toMatchObject({ votes: 1, myVote: true });

    const again = yield* asAna("PATCH", path, { myVote: true });

    expect(yield* bodyOf(Question, again)).toMatchObject({ votes: 1, myVote: true });
  }),
);

test(
  "taking the vote back subtracts it",
  Effect.gen(function* () {
    const response = yield* asAna("PATCH", "/api/questions/01QV6000000000000000000000", {
      myVote: false,
    });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Question, response)).toMatchObject({ votes: 1, myVote: false });
  }),
);

test(
  "voting one's own question answers OwnQuestion",
  Effect.gen(function* () {
    const response = yield* asAna("PATCH", "/api/questions/01QV7000000000000000000000", {
      myVote: true,
    });

    expect(response.status).toBe(409);
    expect(failedWith(response, OwnQuestion)).toBe(true);
  }),
);

test(
  "voting an answered question answers QuestionNotFound",
  Effect.gen(function* () {
    const response = yield* asAna("PATCH", "/api/questions/01QV8000000000000000000000", {
      myVote: true,
    });

    expect(response.status).toBe(404);
    expect(failedWith(response, QuestionNotFound)).toBe(true);
  }),
);

test(
  "deleting one's own question takes it away with its votes",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const id = "01QV9000000000000000000000";
    const response = yield* asAna("DELETE", `/api/questions/${id}`);

    expect(response.status).toBe(204);
    expect((yield* studentQuestions(url, actions)).map((question) => question.id)).not.toContain(
      id,
    );
  }),
);

test(
  "deleting someone else's question answers NotAuthor",
  Effect.gen(function* () {
    const response = yield* asAna("DELETE", "/api/questions/01QVA000000000000000000000");

    expect(response.status).toBe(403);
    expect(failedWith(response, NotAuthor)).toBe(true);
  }),
);

test(
  "the teacher sees the open questions by votes and the answered ones last, without author",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* request(url, "GET", `/api/admin/questions?sessionId=${teachers}`, {
      cookie,
    });

    expect(response.status).toBe(200);
    expect(JSON.stringify(response.body)).not.toContain("author");

    const questions = yield* bodyOf(Schema.Array(AdminQuestion), response);

    expect(questions.map((question) => [question.id, question.votes, question.answered])).toEqual([
      ["01QD2000000000000000000000", 2, false],
      ["01QD1000000000000000000000", 1, false],
      ["01QD3000000000000000000000", 3, true],
    ]);
  }),
);

test(
  "marking a question as answered hides it from the student",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const id = "01QVB000000000000000000000";
    const response = yield* answer(url, id, true);

    expect(response.status).toBe(200);
    expect(yield* bodyOf(AdminQuestion, response)).toMatchObject({ id, answered: true });
    expect((yield* studentQuestions(url, actions)).map((question) => question.id)).not.toContain(
      id,
    );
  }),
);

test(
  "reopening a question shows it again to the student with its votes",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const id = "01QVC000000000000000000000";
    const response = yield* answer(url, id, false);

    expect(response.status).toBe(200);
    expect(yield* bodyOf(AdminQuestion, response)).toMatchObject({ id, answered: false });
    expect(
      (yield* studentQuestions(url, actions)).find((question) => question.id === id),
    ).toMatchObject({ votes: 2, myVote: true });
  }),
);
