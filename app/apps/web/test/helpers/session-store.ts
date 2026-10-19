import { SessionChange, SessionInput } from "@kurasu/contract/sessions";
import type { Session } from "@kurasu/contract/sessions";
import * as Schema from "effect/Schema";
import { http, HttpResponse } from "msw";

import { ulid } from "../fixtures/ids.ts";
import { apiError, noContent, readJson, url } from "./api.ts";

const summaryOf = ({ currentSlide: _slide, currentStep: _step, ...summary }: Session) => summary;

// The teacher's sessions endpoints over an in-memory list. Positions follow
// the list's order.
export const sessionStore = (initial: ReadonlyArray<Session>) => {
  let sessions = [...initial];
  const writes: Array<{ method: string; body: unknown }> = [];

  const renumber = () => {
    sessions = sessions.map((session, index) => ({ ...session, position: index + 1 }));
  };

  const handlers = [
    http.get(url("/admin/sessions"), () => HttpResponse.json(sessions.map(summaryOf))),
    http.get(url("/admin/sessions/:id"), ({ params }) => {
      const session = sessions.find((each) => each.id === params["id"]);

      return session == null ? apiError("SessionNotFound") : HttpResponse.json(session);
    }),
    http.post(url("/admin/sessions"), async ({ request }) => {
      const input = await readJson(request, SessionInput);

      const created: Session = {
        id: ulid("Y", 100 + sessions.length),
        ...input,
        position: sessions.length + 1,
        enabled: false,
        currentSlide: 1,
        currentStep: 1,
      };

      writes.push({ method: "POST", body: input });
      sessions = [...sessions, created];

      return HttpResponse.json(created, { status: 201 });
    }),
    http.patch(url("/admin/sessions/:id"), async ({ params, request }) => {
      const change = await readJson(request, SessionChange);

      writes.push({ method: "PATCH", body: change });
      sessions = sessions.map((each) => (each.id === params["id"] ? { ...each, ...change } : each));

      return HttpResponse.json(sessions.find((each) => each.id === params["id"]));
    }),
    http.delete(url("/admin/sessions/:id"), ({ params }) => {
      writes.push({ method: "DELETE", body: params["id"] });
      sessions = sessions.filter((each) => each.id !== params["id"]);

      return noContent();
    }),
    http.put(url("/admin/session-order"), async ({ request }) => {
      const { ids } = await readJson(request, Schema.Struct({ ids: Schema.Array(Schema.String) }));

      writes.push({ method: "PUT", body: ids });
      sessions = ids.flatMap((id) => sessions.filter((each) => each.id === id));
      renumber();

      return noContent();
    }),
  ];

  return { handlers, writes, current: () => sessions };
};
