import type { Material } from "@kurasu/contract/materials";
import type { Poll } from "@kurasu/contract/polls";
import type { RaisedHandSummary } from "@kurasu/contract/raised-hands";
import type { Session } from "@kurasu/contract/sessions";
import { screen } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { material } from "../fixtures/content.ts";
import { student } from "../fixtures/people.ts";
import { validSlides } from "../fixtures/slides.ts";
import { getJson, url } from "./api.ts";

interface Options {
  session: Session;
  slides?: string | null;
  materials?: ReadonlyArray<Material>;
  activePolls?: ReadonlyArray<Poll>;
  closedPolls?: ReadonlyArray<Poll>;
  hands?: ReadonlyArray<RaisedHandSummary>;
}

export const slidesMaterial = (sessionId: string) =>
  material(10, sessionId, "Slides de la sesión.html", { isSlides: true, contentType: "text/html" });

// Everything /aula asks for as it opens, for a student in the highlighted
// session. Tests override what they change with server.use.
export const studentClassroom = ({
  session,
  slides = validSlides,
  materials,
  activePolls = [],
  closedPolls = [],
  hands = [],
}: Options) => {
  const { currentSlide: _slide, currentStep: _step, ...summary } = session;
  const slidesFile = slidesMaterial(session.id);

  return [
    getJson("/me", student),
    getJson("/sessions", [summary]),
    getJson(`/sessions/${session.id}`, session),
    getJson("/materials", materials ?? (slides == null ? [] : [slidesFile])),
    http.get(url(`/materials/${slidesFile.id}/file`), () =>
      HttpResponse.text(slides ?? "", { headers: { "content-type": "text/html" } }),
    ),
    http.get(url("/polls"), ({ request }) =>
      HttpResponse.json(
        new URL(request.url).searchParams.get("status") === "closed" ? closedPolls : activePolls,
      ),
    ),
    getJson("/questions", []),
    getJson("/raised-hands", hands),
  ];
};

// The panel already shows while the classroom is in skeleton, so a test that
// works the panel waits for the session's title, which only the real one has.
export const realClassroom = (session: Pick<Session, "title">) =>
  screen.findByRole("heading", { level: 1, name: session.title });
