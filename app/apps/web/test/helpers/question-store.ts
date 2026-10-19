import type { Question } from "@kurasu/contract/questions";
import * as Schema from "effect/Schema";
import { http, HttpResponse } from "msw";

import { ulid } from "../fixtures/ids.ts";
import { noContent, readJson, url } from "./api.ts";

// The student's questions endpoints over an in-memory list, so a screen sees
// its own writes when it asks again. The API returns them by votes.
export const questionStore = (initial: ReadonlyArray<Question>) => {
  let questions = [...initial];

  const byVotes = () => questions.toSorted((a, b) => b.votes - a.votes);

  const handlers = [
    http.get(url("/questions"), ({ request }) => {
      const sessionId = new URL(request.url).searchParams.get("sessionId");

      return HttpResponse.json(byVotes().filter((each) => each.sessionId === sessionId));
    }),
    http.post(url("/questions"), async ({ request }) => {
      const body = await readJson(
        request,
        Schema.Struct({ sessionId: Schema.String, body: Schema.String }),
      );

      const asked: Question = {
        id: ulid("Q", 900 + questions.length),
        sessionId: body.sessionId,
        body: body.body,
        votes: 0,
        myVote: false,
        mine: true,
      };

      questions = [...questions, asked];

      return HttpResponse.json(asked, { status: 201 });
    }),
    http.patch(url("/questions/:id"), async ({ params, request }) => {
      const { myVote } = await readJson(request, Schema.Struct({ myVote: Schema.Boolean }));

      questions = questions.map((each) =>
        each.id === params["id"] && each.myVote !== myVote
          ? { ...each, myVote, votes: each.votes + (myVote ? 1 : -1) }
          : each,
      );

      return HttpResponse.json(questions.find((each) => each.id === params["id"]));
    }),
    http.delete(url("/questions/:id"), ({ params }) => {
      questions = questions.filter((each) => each.id !== params["id"]);

      return noContent();
    }),
  ];

  return { handlers, current: () => questions };
};
