import type { RaisedHandSummary } from "@kurasu/contract/raised-hands";
import * as Schema from "effect/Schema";
import { http, HttpResponse } from "msw";

import { student } from "../fixtures/people.ts";
import { noContent, readJson, url } from "./api.ts";

// The student's raised-hands endpoints over an in-memory list.
export const handStore = (initial: ReadonlyArray<RaisedHandSummary>) => {
  let hands = [...initial];
  const writes: Array<string> = [];

  const handlers = [
    http.get(url("/raised-hands"), () => HttpResponse.json(hands)),
    http.post(url("/raised-hands"), async ({ request }) => {
      const { sessionId } = await readJson(request, Schema.Struct({ sessionId: Schema.String }));

      writes.push("POST");
      hands = [...hands, { sessionId, userId: student.id }];

      return HttpResponse.json(
        { sessionId, user: { id: student.id, name: student.name, avatar: student.avatar } },
        { status: 201 },
      );
    }),
    http.delete(url("/raised-hands"), () => {
      writes.push("DELETE");
      hands = hands.filter((hand) => hand.userId !== student.id);

      return noContent();
    }),
  ];

  return { handlers, writes, set: (next: ReadonlyArray<RaisedHandSummary>) => (hands = [...next]) };
};
