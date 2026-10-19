import type { Poll } from "@kurasu/contract/polls";
import { ResponseValue } from "@kurasu/contract/polls";
import * as Schema from "effect/Schema";
import { http, HttpResponse } from "msw";

import { readJson, url } from "./api.ts";

// PATCH /api/polls/{id}: records each vote and answers the poll with the vote
// and the results the test gives for it.
export const voteHandler = (answer: (myResponse: ResponseValue) => Poll) => {
  const votes: Array<ResponseValue> = [];

  const handler = http.patch(url("/polls/:id"), async ({ request }) => {
    const { myResponse } = await readJson(request, Schema.Struct({ myResponse: ResponseValue }));

    votes.push(myResponse);

    return HttpResponse.json(answer(myResponse));
  });

  return { handler, votes };
};
