import { PollChange, PollDraft } from "@kurasu/contract/polls";
import type { AdminPoll } from "@kurasu/contract/polls";
import { http, HttpResponse } from "msw";

import { ulid } from "../fixtures/ids.ts";
import { noContent, readJson, url } from "./api.ts";

// The teacher's polls endpoints over an in-memory list.
export const pollStore = (initial: ReadonlyArray<AdminPoll>) => {
  let polls = [...initial];
  const writes: Array<{ method: string; body: unknown }> = [];

  const handlers = [
    http.get(url("/admin/polls"), () => HttpResponse.json(polls)),
    http.post(url("/admin/polls"), async ({ request }) => {
      const draft = await readJson(request, PollDraft);

      const created: AdminPoll = {
        ...draft,
        id: ulid("P", 700 + polls.length),
        status: "draft",
        results: { count: 0 },
      };

      writes.push({ method: "POST", body: draft });
      polls = [...polls, created];

      return HttpResponse.json(created, { status: 201 });
    }),
    http.patch(url("/admin/polls/:id"), async ({ params, request }) => {
      const change = await readJson(request, PollChange);

      writes.push({ method: "PATCH", body: change });
      polls = polls.map((each) => (each.id === params["id"] ? { ...each, ...change } : each));

      return HttpResponse.json(polls.find((each) => each.id === params["id"]));
    }),
    http.delete(url("/admin/polls/:id"), ({ params }) => {
      writes.push({ method: "DELETE", body: params["id"] });
      polls = polls.filter((each) => each.id !== params["id"]);

      return noContent();
    }),
  ];

  return { handlers, writes };
};
