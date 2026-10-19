import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import {
  choicePoll,
  closed,
  material,
  planning,
  question,
  scalePoll,
  vibeCoding,
} from "./fixtures/content.ts";
import { student } from "./fixtures/people.ts";
import { getJson, url } from "./helpers/api.ts";
import { questionStore } from "./helpers/question-store.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";

const home = (...sessions: Parameters<typeof getJson>[1][]) =>
  server.use(getJson("/me", student), getJson("/sessions", sessions), getJson("/polls", []));

const openLink = async (session: string, link: string, sheet: string) => {
  const { user } = await renderRoute("/");
  const card = await screen.findByRole("region", { name: session });

  await user.click(within(card).getByRole("button", { name: link }));

  return { user, sheet: screen.getByRole("dialog", { name: sheet }) };
};

describe("material from the card", () => {
  test("the sheet lists the material and each row downloads its file, the slides too", async () => {
    const slides = material(1, planning.id, "Slides de la sesión.html", {
      isSlides: true,
      contentType: "text/html",
      size: 3_355_443,
    });

    const guide = material(2, planning.id, "Guía de planificación.pdf");

    home(planning);
    server.use(getJson("/materials", [slides, guide]));

    const { sheet } = await openLink(planning.title, "Material", "Material");

    const rows = await within(sheet).findAllByRole("listitem");

    expect(rows.map((row) => row.textContent)).toEqual([
      "Slides de la sesión.htmlHTML · 3,2 MB",
      "Guía de planificación.pdfPDF · 480 KB",
    ]);
    expect(
      within(sheet)
        .getAllByRole("link")
        .map((link) => link.getAttribute("href")),
    ).toEqual([`/api/materials/${slides.id}/file`, `/api/materials/${guide.id}/file`]);
  });

  test("a session without material shows an empty list", async () => {
    home(planning);
    server.use(getJson("/materials", []));

    const { sheet } = await openLink(planning.title, "Material", "Material");

    expect(await within(sheet).findByText("Todavía no hay material.")).toBeTruthy();
  });
  test("Escape closes the sheet", async () => {
    home(planning);
    server.use(getJson("/materials", []));

    const { user, sheet } = await openLink(planning.title, "Material", "Material");

    await within(sheet).findByText("Todavía no hay material.");
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Material" })).toBeNull();
  });
});

describe("closed polls from the card", () => {
  test("the closed polls are asked for only when the sheet opens, folded, with the own answer marked", async () => {
    const closedRequests: Array<string> = [];

    const answered = closed(
      choicePoll(planning.id),
      { choice: 1 },
      { count: 3, choice: [1, 2, 0, 0] },
    );

    const unanswered = closed(scalePoll(planning.id), null, { count: 2, scale: [0, 0, 1, 1, 0] });

    server.use(
      getJson("/me", student),
      getJson("/sessions", [planning]),
      http.get(url("/polls"), ({ request }) => {
        const query = new URL(request.url).searchParams;

        if (query.get("status") === "closed") {
          closedRequests.push(query.get("sessionId") ?? "");

          return HttpResponse.json([answered, unanswered]);
        }

        return HttpResponse.json([]);
      }),
    );

    const { user } = await renderRoute("/");
    const card = await screen.findByRole("region", { name: planning.title });

    expect(closedRequests).toEqual([]);

    await user.click(within(card).getByRole("button", { name: "Encuestas" }));

    const sheet = screen.getByRole("dialog", { name: "Encuestas cerradas" });
    const first = await within(sheet).findByRole("article", { name: answered.prompt });
    const second = within(sheet).getByRole("article", { name: unanswered.prompt });

    expect(closedRequests).toEqual([planning.id]);
    expect(within(sheet).queryByRole("list", { name: "Resultados" })).toBeNull();
    expect(within(first).getByText("Cerrada · 3 respuestas")).toBeTruthy();

    await user.click(within(first).getByRole("button", { expanded: false }));

    expect(within(first).getByText("✓ Algo")).toBeTruthy();

    await user.click(within(second).getByRole("button", { expanded: false }));

    expect(within(first).queryByRole("list", { name: "Resultados" })).toBeNull();
    expect(
      within(within(second).getByRole("list", { name: "Resultados" }))
        .getAllByRole("listitem")
        .some((bar) => bar.getAttribute("aria-current") === "true"),
    ).toBe(false);
  });

  test("a session without closed polls shows an empty list", async () => {
    home(planning);

    const { sheet } = await openLink(planning.title, "Encuestas", "Encuestas cerradas");

    expect(await within(sheet).findByText("Todavía no hay encuestas cerradas.")).toBeTruthy();
  });
});

describe("questions from the card", () => {
  test("asking posts the question and it shows as the student's own, without voting", async () => {
    const store = questionStore([
      question(1, planning.id, "¿Hay plantillas de plan?", { votes: 2 }),
    ]);

    home(planning);
    server.use(...store.handlers);

    const { user, sheet } = await openLink(planning.title, "Preguntas", "Preguntas");

    await user.type(
      await within(sheet).findByLabelText("Hacé una pregunta"),
      "¿Conviene revisar el diff?",
    );
    await user.click(within(sheet).getByRole("button", { name: "Enviar" }));

    const asked = await within(sheet).findByRole("listitem", {
      name: "¿Conviene revisar el diff?",
    });

    expect(within(asked).getByText("Tuya")).toBeTruthy();
    expect(within(asked).getByRole("button", { name: "Votos: 0" })).toHaveProperty(
      "disabled",
      true,
    );
  });

  test("voting and taking the vote back adds and removes it, ordered by votes", async () => {
    const store = questionStore([
      question(1, planning.id, "¿Cuánto detalle tiene que tener un plan?", { votes: 3 }),
      question(2, planning.id, "¿Conviene revisar el diff primero?", { votes: 3 }),
    ]);

    home(planning);
    server.use(...store.handlers);

    const { user, sheet } = await openLink(planning.title, "Preguntas", "Preguntas");

    const second = await within(sheet).findByRole("listitem", {
      name: "¿Conviene revisar el diff primero?",
    });

    await user.click(within(second).getByRole("button", { name: "Votos: 3" }));

    await waitFor(() =>
      expect(
        within(sheet)
          .getAllByRole("listitem")
          .map((row) => row.getAttribute("aria-label")),
      ).toEqual(["¿Conviene revisar el diff primero?", "¿Cuánto detalle tiene que tener un plan?"]),
    );

    const voteButton = within(within(sheet).getAllByRole("listitem")[0] ?? sheet).getByRole(
      "button",
      {
        name: "Votos: 4",
      },
    );

    expect(voteButton.getAttribute("aria-pressed")).toBe("true");

    await user.click(voteButton);

    expect(await within(sheet).findAllByRole("button", { name: "Votos: 3" })).toHaveLength(2);
  });

  test("deleting the own question asks for confirmation, sends the delete and removes it", async () => {
    const own = question(1, planning.id, "¿Qué pasa si el plan está mal?", { mine: true });
    const store = questionStore([own]);

    home(planning);
    server.use(...store.handlers);

    const { user, sheet } = await openLink(planning.title, "Preguntas", "Preguntas");

    const row = await within(sheet).findByRole("listitem", { name: own.body });

    await user.click(within(row).getByRole("button", { name: "Borrar tu pregunta" }));

    const confirm = screen.getByRole("alertdialog", { name: "¿Borrar tu pregunta?" });

    expect(store.current()).toHaveLength(1);

    await user.click(within(confirm).getByRole("button", { name: "Borrar" }));

    await waitFor(() =>
      expect(within(sheet).queryByRole("listitem", { name: own.body })).toBeNull(),
    );
    expect(store.current()).toEqual([]);
  });

  test("Escape on the delete confirmation closes only the confirmation, and the next one the sheet", async () => {
    const own = question(1, planning.id, "¿Y si me arrepiento?", { mine: true });
    const store = questionStore([own]);

    home(planning);
    server.use(...store.handlers);

    const { user, sheet } = await openLink(planning.title, "Preguntas", "Preguntas");

    const row = await within(sheet).findByRole("listitem", { name: own.body });

    await user.click(within(row).getByRole("button", { name: "Borrar tu pregunta" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(screen.getByRole("dialog", { name: "Preguntas" })).toBe(sheet);
    expect(store.current()).toEqual([own]);

    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "Preguntas" })).toBeNull();
  });

  test("an earlier session is read-only: no form, no voting, no deleting", async () => {
    const store = questionStore([
      question(1, vibeCoding.id, "¿El agente se acuerda de lo de ayer?", { votes: 4 }),
      question(2, vibeCoding.id, "¿Conviene pedirle todo de una?", { mine: true }),
    ]);

    home(vibeCoding, planning);
    server.use(...store.handlers);

    const { user } = await renderRoute("/");
    const rail = await screen.findByRole("region", { name: "Sesiones anteriores" });

    await user.click(within(rail).getByRole("button", { name: vibeCoding.title }));
    await user.click(within(rail).getByRole("button", { name: "Preguntas" }));

    const sheet = screen.getByRole("dialog", { name: "Preguntas" });

    await within(sheet).findByRole("listitem", { name: "¿El agente se acuerda de lo de ayer?" });

    expect(within(sheet).queryByLabelText("Hacé una pregunta")).toBeNull();
    expect(within(sheet).queryByRole("button", { name: "Borrar tu pregunta" })).toBeNull();
    expect(
      within(sheet)
        .getAllByRole("button", { name: /^Votos/ })
        .every((button) => button.hasAttribute("disabled")),
    ).toBe(true);
  });
});
