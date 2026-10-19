import type { AdminQuestion } from "@kurasu/contract/questions";
import { screen, waitFor, within } from "@testing-library/react";
import * as Schema from "effect/Schema";
import { http, HttpResponse } from "msw";
import type { HttpHandler } from "msw";
import { describe, expect, test } from "vitest";

import {
  adminPoll,
  adminQuestion,
  choicePoll,
  material,
  planning,
  question,
  scalePoll,
  sessionDetail,
} from "./fixtures/content.ts";
import { otherStudent, student, teacher } from "./fixtures/people.ts";
import { validSlides } from "./fixtures/slides.ts";
import { getJson, noContent, readJson, url } from "./helpers/api.ts";
import { pollStore } from "./helpers/poll-store.ts";
import { recorder } from "./helpers/recorder.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { slidesFrame } from "./helpers/slides-frame.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const slides = material(1, planning.id, "Slides.html", {
  isSlides: true,
  contentType: "text/html",
});

// `overrides` answer before the page's own handlers.
const openPage = async (
  tab: string,
  options: Partial<Parameters<typeof teacherSession>[0]> = {},
  overrides: ReadonlyArray<HttpHandler> = [],
) => {
  const page = teacherSession({
    sessions: [{ ...sessionDetail(planning, 2, 2), enabled: true }],
    materials: [slides],
    files: { [slides.id]: validSlides },
    people: [teacher, student, otherStudent],
    ...options,
  });

  server.use(...page.handlers);
  server.use(...overrides);

  const rendered = await renderRoute(`/admin/sesiones/${planning.id}?tab=${tab}`);

  await screen.findByRole("tablist", { name: "Secciones de la sesión" });

  return { ...rendered, ...page };
};

const asked = (n: number, body: string): AdminQuestion =>
  adminQuestion(question(n, planning.id, body));

const aulaTab = () => screen.getByRole("tab", { name: /Aula/ });

describe("session page: classroom slides", () => {
  test("moving forward changes the position before the answer and patches slide and step", async () => {
    const response = Promise.withResolvers<Response>();
    const moves = recorder<unknown>();

    const { user } = await openPage("aula");

    server.use(
      http.patch(url(`/admin/sessions/${planning.id}`), async ({ request }) => {
        moves.record(await request.json());

        return response.promise;
      }),
    );

    const frame = await slidesFrame();

    await frame.announce();
    await waitFor(() => expect(frame.lastGo()).toEqual({ slide: 2, step: 2 }));

    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => expect(frame.lastGo()).toEqual({ slide: 2, step: 3 }));
    expect(moves.calls).toEqual([{ currentSlide: 2, currentStep: 3 }]);

    response.resolve(HttpResponse.json({ ...sessionDetail(planning, 2, 3), enabled: true }));
  });

  test("a failed move goes back to the previous position", async () => {
    const response = Promise.withResolvers<Response>();

    const { user } = await openPage("aula");

    server.use(http.patch(url(`/admin/sessions/${planning.id}`), () => response.promise));

    const frame = await slidesFrame();

    await frame.announce();
    await waitFor(() => expect(frame.lastGo()).toEqual({ slide: 2, step: 2 }));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => expect(frame.lastGo()).toEqual({ slide: 2, step: 3 }));

    response.resolve(HttpResponse.json({}, { status: 500 }));

    await waitFor(() => expect(frame.lastGo()).toEqual({ slide: 2, step: 2 }));
  });

  test("presenting opens /admin/presentar/$id in another tab", async () => {
    await openPage("aula");

    const present = await screen.findByRole("link", { name: "Presentar en otra pestaña" });

    expect(present.getAttribute("href")).toBe(`/admin/presentar/${planning.id}`);
    expect(present.getAttribute("target")).toBe("_blank");
  });

  test("a session without slides shows an empty stage without navigation", async () => {
    await openPage("aula", { materials: [] });

    expect(await screen.findByText("Esta sesión todavía no tiene slides.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Siguiente" })).toBeNull();
  });
});

describe("session page: classroom panel and badges", () => {
  test("a new question away from Aula shows a badge with the number on the Aula tab", async () => {
    const { socket } = await openPage("contenido", { questions: [asked(1, "¿Primera?")] });

    await waitFor(() => expect(socket.connections()).toBe(1));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(within(aulaTab()).queryByLabelText(/preguntas nuevas/)).toBeNull();

    server.use(getJson("/admin/questions", [asked(1, "¿Primera?"), asked(2, "¿Segunda?")]));
    socket.send({ type: "changed", topic: "questions" });

    expect((await within(aulaTab()).findByLabelText("1 preguntas nuevas")).textContent).toBe("1");
  });

  test("entering Aula marks the questions as seen and the badge goes away", async () => {
    const { user, socket } = await openPage("contenido", { questions: [] });

    await waitFor(() => expect(socket.connections()).toBe(1));
    await new Promise((resolve) => setTimeout(resolve, 50));
    server.use(getJson("/admin/questions", [asked(1, "¿Primera?")]));
    socket.send({ type: "changed", topic: "questions" });

    await within(aulaTab()).findByLabelText("1 preguntas nuevas");
    await user.click(aulaTab());

    await waitFor(() => expect(within(aulaTab()).queryByLabelText(/preguntas nuevas/)).toBeNull());

    await user.click(screen.getByRole("tab", { name: /Contenido/ }));

    expect(within(aulaTab()).queryByLabelText(/preguntas nuevas/)).toBeNull();
  });

  test("a raised hand away from Aula adds to the Aula tab's badge", async () => {
    const { socket } = await openPage("encuestas");

    await waitFor(() => expect(socket.connections()).toBe(1));

    server.use(
      getJson("/admin/raised-hands", [
        {
          sessionId: planning.id,
          user: { id: otherStudent.id, name: otherStudent.name, avatar: otherStudent.avatar },
        },
      ]),
    );
    socket.send({ type: "changed", topic: "hands" });

    expect((await within(aulaTab()).findByLabelText("1 manos levantadas")).textContent).toBe("1");
  });

  test("lowering a hand deletes that hand and it leaves the row", async () => {
    const lowered = recorder<string>();

    let hands = [
      {
        sessionId: planning.id,
        user: { id: otherStudent.id, name: otherStudent.name, avatar: otherStudent.avatar },
      },
    ];

    server.use(
      http.delete(url("/admin/raised-hands"), ({ request }) => {
        lowered.record(new URL(request.url).search);
        hands = [];

        return noContent();
      }),
    );

    const { user } = await openPage("aula", {}, [
      http.get(url("/admin/raised-hands"), () => HttpResponse.json(hands)),
    ]);

    const panelTabs = await screen.findByRole("tablist", { name: "Pestañas del panel" });

    await user.click(within(panelTabs).getByRole("tab", { name: "Preguntas" }));
    await user.click(within(panelTabs).getByRole("tab", { name: "Encuestas" }));

    const presence = await screen.findByRole("list", { name: "Presentes" });

    await user.click(
      await within(presence).findByRole("button", {
        name: `Bajar la mano de ${otherStudent.name}`,
      }),
    );

    await waitFor(() =>
      expect(within(presence).queryByRole("button", { name: /Bajar la mano/ })).toBeNull(),
    );
    expect(lowered.calls).toEqual([`?sessionId=${planning.id}&userId=${otherStudent.id}`]);
  });

  test("an answered question goes last, dimmed, and reopening it brings it back", async () => {
    let questions = [asked(1, "¿Primera?"), asked(2, "¿Segunda?")];

    server.use(
      http.patch(url("/admin/questions/:id"), async ({ params, request }) => {
        const { answered } = await readJson(request, Schema.Struct({ answered: Schema.Boolean }));

        questions = questions.map((each) =>
          each.id === params["id"] ? { ...each, answered } : each,
        );

        return HttpResponse.json(questions.find((each) => each.id === params["id"]));
      }),
    );

    const { user } = await openPage("aula");

    server.use(http.get(url("/admin/questions"), () => HttpResponse.json(questions)));
    await user.click(await screen.findByRole("tab", { name: "Preguntas" }));

    const panel = screen.getByRole("tabpanel");
    const first = await within(panel).findByRole("listitem", { name: "¿Primera?" });

    await user.click(within(first).getByRole("button", { name: "Marcar como respondida" }));

    await waitFor(() =>
      expect(
        within(panel)
          .getAllByRole("listitem")
          .map((row) => row.getAttribute("aria-label")),
      ).toEqual(["¿Segunda?", "¿Primera?"]),
    );
    expect(within(panel).getByRole("listitem", { name: "¿Primera?" }).className).toContain(
      "opacity-50",
    );

    await user.click(
      within(within(panel).getByRole("listitem", { name: "¿Primera?" })).getByRole("button", {
        name: "Volver a abrir",
      }),
    );

    await waitFor(() =>
      expect(within(panel).getAllByRole("listitem")[0]?.getAttribute("aria-label")).toBe(
        "¿Primera?",
      ),
    );
  });

  test("the panel's polls activate and close from their card, with the closed ones folded as Cerradas (n)", async () => {
    const store = pollStore([
      adminPoll(choicePoll(planning.id), "draft", { count: 0 }),
      adminPoll(scalePoll(planning.id), "closed", { count: 1, scale: [1, 0, 0, 0, 0] }),
    ]);

    const { user } = await openPage("aula", {}, store.handlers);

    const panel = await screen.findByRole("tabpanel");

    const draft = await within(panel).findByRole("article", {
      name: choicePoll(planning.id).prompt,
    });

    expect(within(panel).getByRole("button", { name: "Cerradas (1)" })).toBeTruthy();
    expect(
      within(panel).queryByRole("article", { name: scalePoll(planning.id).prompt }),
    ).toBeNull();

    await user.click(within(draft).getByRole("button", { expanded: false }));
    await user.click(within(draft).getByRole("button", { name: "Activar" }));
    await waitFor(() => expect(within(draft).getByText("Activa")).toBeTruthy());
    await user.click(within(draft).getByRole("button", { name: "Cerrar" }));

    await waitFor(() =>
      expect(within(panel).getByRole("button", { name: "Cerradas (2)" })).toBeTruthy(),
    );
    expect(store.writes).toEqual([
      { method: "PATCH", body: { status: "active" } },
      { method: "PATCH", body: { status: "closed" } },
    ]);
  });

  test("the teacher is present from another tab and the panel never hides", async () => {
    const { user, socket } = await openPage("contenido");

    await waitFor(() => expect(socket.connections()).toBe(1));

    await user.click(aulaTab());

    expect(await screen.findByRole("complementary", { name: "Panel del aula" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Ocultar el panel" })).toBeNull();
    expect(socket.connections()).toBe(1);
  });
});

describe("/admin/presentar/$id", () => {
  test("opening shows the session's slide without controls", async () => {
    const page = teacherSession({
      sessions: [{ ...sessionDetail(planning, 3, 1), enabled: true }],
      materials: [slides],
      files: { [slides.id]: validSlides },
    });

    server.use(...page.handlers);
    await renderRoute(`/admin/presentar/${planning.id}`);

    const frame = await slidesFrame();

    await frame.announce();

    await waitFor(() => expect(frame.lastGo()).toEqual({ slide: 3, step: 1 }));
    expect(screen.queryByRole("button", { name: "Siguiente" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Tu cuenta" })).toBeNull();
  });

  test("when the teacher moves, the slide notice moves it forward", async () => {
    const page = teacherSession({
      sessions: [{ ...sessionDetail(planning, 1, 1), enabled: true }],
      materials: [slides],
      files: { [slides.id]: validSlides },
    });

    server.use(...page.handlers);
    await renderRoute(`/admin/presentar/${planning.id}`);

    const frame = await slidesFrame();

    await frame.announce();
    await waitFor(() => expect(frame.lastGo()).toEqual({ slide: 1, step: 1 }));

    server.use(
      getJson(`/admin/sessions/${planning.id}`, {
        ...sessionDetail(planning, 2, 1),
        enabled: true,
      }),
    );
    page.socket.send({ type: "changed", topic: "slide" });

    await waitFor(() => expect(frame.lastGo()).toEqual({ slide: 2, step: 1 }));
  });

  test("a session without slides shows an empty stage", async () => {
    const page = teacherSession({ sessions: [{ ...sessionDetail(planning), enabled: true }] });

    server.use(...page.handlers);
    await renderRoute(`/admin/presentar/${planning.id}`);

    expect(await screen.findByText("Esta sesión todavía no tiene slides.")).toBeTruthy();
  });
});
