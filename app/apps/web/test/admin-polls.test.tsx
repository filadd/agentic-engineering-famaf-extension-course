import type { AdminPoll } from "@kurasu/contract/polls";
import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import {
  adminFeedback,
  adminPoll,
  choicePoll,
  planning,
  scalePoll,
  sessionDetail,
  wordsPoll,
} from "./fixtures/content.ts";
import { getJson } from "./helpers/api.ts";
import { pollStore } from "./helpers/poll-store.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const openPolls = async (polls: ReadonlyArray<AdminPoll> = [], featured = true) => {
  const store = pollStore(polls);

  const page = teacherSession({
    sessions: [{ ...sessionDetail(planning), enabled: true, featured }],
  });

  server.use(...store.handlers, ...page.handlers);

  const rendered = await renderRoute(`/admin/sesiones/${planning.id}?tab=encuestas`);

  await screen.findByRole("heading", { name: "Encuestas" });

  return { ...rendered, store, socket: page.socket };
};

const startNew = async (user: Awaited<ReturnType<typeof renderRoute>>["user"], type: string) => {
  await user.click(screen.getByRole("button", { name: "Nueva encuesta" }));
  await user.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: type }));

  return screen.getByRole("article", { name: "Nueva encuesta" });
};

const draftChoice = adminPoll(choicePoll(planning.id), "draft", { count: 0 });

describe("session page: polls", () => {
  test("a draft of the featured session has Activar", async () => {
    const { user } = await openPolls([draftChoice]);

    const draft = await screen.findByRole("article", { name: draftChoice.prompt });

    await user.click(within(draft).getByRole("button", { expanded: false }));

    expect(within(draft).getByRole("button", { name: "Activar" })).toBeTruthy();
    expect(screen.queryByText("Solo se activan encuestas en la sesión destacada.")).toBeNull();
  });

  test("a draft of a session that is not the featured one has no Activar and the tab explains why", async () => {
    const { user } = await openPolls([draftChoice], false);

    const draft = await screen.findByRole("article", { name: draftChoice.prompt });

    await user.click(within(draft).getByRole("button", { expanded: false }));

    expect(within(draft).getByRole("button", { name: "Borrar" })).toBeTruthy();
    expect(within(draft).queryByRole("button", { name: "Activar" })).toBeNull();
    expect(screen.getByText("Solo se activan encuestas en la sesión destacada.")).toBeTruthy();
  });

  test("a draft of the featured session has Activar", async () => {
    const { user } = await openPolls([draftChoice]);

    const draft = await screen.findByRole("article", { name: draftChoice.prompt });

    await user.click(within(draft).getByRole("button", { expanded: false }));

    expect(within(draft).getByRole("button", { name: "Activar" })).toBeTruthy();
    expect(screen.queryByText("Solo se activan encuestas en la sesión destacada.")).toBeNull();
  });

  test("a draft of a session that is not the featured one has no Activar and the tab explains why", async () => {
    const { user } = await openPolls([draftChoice], false);

    const draft = await screen.findByRole("article", { name: draftChoice.prompt });

    await user.click(within(draft).getByRole("button", { expanded: false }));

    expect(within(draft).getByRole("button", { name: "Borrar" })).toBeTruthy();
    expect(within(draft).queryByRole("button", { name: "Activar" })).toBeNull();
    expect(screen.getByText("Solo se activan encuestas en la sesión destacada.")).toBeTruthy();
  });

  test("outside the featured session the note sits under the last draft, above the closed polls", async () => {
    const closedWords = adminPoll(wordsPoll(planning.id), "closed", { count: 0, words: [] });

    await openPolls([closedWords, draftChoice], false);

    const draft = await screen.findByRole("article", { name: draftChoice.prompt });
    const note = screen.getByText("Solo se activan encuestas en la sesión destacada.");
    const closed = screen.getByRole("article", { name: closedWords.prompt });

    expect(draft.nextElementSibling).toBe(note);
    expect(note.nextElementSibling).toBe(closed);
  });

  test("without polls the tab says so under the creator", async () => {
    await openPolls([]);

    expect(await screen.findByText("Todavía no hay encuestas.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Nueva encuesta" })).toBeTruthy();
  });

  test("the tab keeps creating, editing, activating, closing and deleting", async () => {
    const active = adminPoll(scalePoll(planning.id), "active", {
      count: 0,
      scale: [0, 0, 0, 0, 0],
    });

    const { user } = await openPolls([draftChoice, active]);

    const draft = await screen.findByRole("article", { name: draftChoice.prompt });
    const open = screen.getByRole("article", { name: active.prompt });

    await user.click(within(draft).getByRole("button", { expanded: false }));

    expect(within(draft).getByLabelText("Opción 1")).toBeTruthy();
    expect(within(draft).getByRole("button", { name: "Activar" })).toBeTruthy();
    expect(within(draft).getByRole("button", { name: "Borrar" })).toBeTruthy();
    expect(within(open).getByRole("button", { name: "Cerrar" })).toBeTruthy();
    expect(within(open).getByRole("button", { name: "Borrar" })).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Ver las respuestas" })).toBeNull();

    await startNew(user, "Opción múltiple");

    expect(screen.getByRole("article", { name: "Nueva encuesta" })).toBeTruthy();
  });

  test("a new choice poll starts with two options, takes up to ten and saves as a draft", async () => {
    const { user, store } = await openPolls();

    await user.click(screen.getByRole("button", { name: "Nueva encuesta" }));

    expect(
      within(screen.getByRole("menu"))
        .getAllByRole("menuitem")
        .map((item) => item.textContent),
    ).toEqual(["Opción múltiple", "Word cloud", "Escala 1 a 5", "Feedback"]);

    await user.click(screen.getByRole("button", { name: "Nueva encuesta" }));

    const card = await startNew(user, "Opción múltiple");

    expect(within(card).getAllByLabelText(/^Opción \d+$/)).toHaveLength(2);

    for (let added = 2; added < 10; added += 1) {
      await user.click(within(card).getByRole("button", { name: "Agregar opción" }));
    }

    expect(within(card).getAllByLabelText(/^Opción \d+$/)).toHaveLength(10);
    expect(within(card).queryByRole("button", { name: "Agregar opción" })).toBeNull();

    for (let removed = 10; removed > 3; removed -= 1) {
      await user.click(within(card).getByRole("button", { name: `Quitar la opción ${removed}` }));
    }

    await user.type(within(card).getByLabelText("Pregunta"), "¿Qué agente usás?");
    await user.type(within(card).getByLabelText("Opción 1"), "Claude");
    await user.type(within(card).getByLabelText("Opción 2"), "Codex");
    await user.type(within(card).getByLabelText("Opción 3"), "Ninguno");
    await user.click(within(card).getByRole("button", { name: "Guardar borrador" }));

    const saved = await screen.findByRole("article", { name: "¿Qué agente usás?" });

    expect(within(saved).getByText("Borrador")).toBeTruthy();
    expect(store.writes).toEqual([
      {
        method: "POST",
        body: {
          sessionId: planning.id,
          type: "choice",
          prompt: "¿Qué agente usás?",
          options: ["Claude", "Codex", "Ninguno"],
        },
      },
    ]);
  });

  test("a new word cloud saves as a draft", async () => {
    const { user, store } = await openPolls();
    const card = await startNew(user, "Word cloud");

    await user.type(within(card).getByLabelText("Pregunta"), "Una palabra para la clase");
    await user.click(within(card).getByRole("button", { name: "Guardar borrador" }));

    expect(await screen.findByRole("article", { name: "Una palabra para la clase" })).toBeTruthy();
    expect(store.writes).toEqual([
      {
        method: "POST",
        body: { sessionId: planning.id, type: "words", prompt: "Una palabra para la clase" },
      },
    ]);
  });

  test("a new scale saves the meaning of its ends as a draft", async () => {
    const { user, store } = await openPolls();
    const card = await startNew(user, "Escala 1 a 5");

    await user.type(within(card).getByLabelText("Pregunta"), "¿Cómo venís?");
    await user.type(within(card).getByLabelText("Qué significa el 1"), "Perdido");
    await user.type(within(card).getByLabelText("Qué significa el 5"), "Clarísimo");
    await user.click(within(card).getByRole("button", { name: "Guardar borrador" }));

    expect(await screen.findByRole("article", { name: "¿Cómo venís?" })).toBeTruthy();
    expect(store.writes).toEqual([
      {
        method: "POST",
        body: {
          sessionId: planning.id,
          type: "scale",
          prompt: "¿Cómo venís?",
          scaleMinLabel: "Perdido",
          scaleMaxLabel: "Clarísimo",
        },
      },
    ]);
  });

  test("editing a draft patches its content", async () => {
    const { user, store } = await openPolls([draftChoice]);
    const card = await screen.findByRole("article", { name: draftChoice.prompt });

    await user.click(within(card).getByRole("button", { expanded: false }));
    await user.clear(within(card).getByLabelText("Opción 4"));
    await user.type(within(card).getByLabelText("Opción 4"), "Todo");
    await user.click(within(card).getByRole("button", { name: "Guardar" }));

    await waitFor(() =>
      expect(store.writes).toEqual([
        {
          method: "PATCH",
          body: { prompt: draftChoice.prompt, options: ["Nada", "Algo", "La mitad", "Todo"] },
        },
      ]),
    );
  });

  test("activating a draft leaves it active and open, without the editor", async () => {
    const { user, store } = await openPolls([draftChoice]);
    const card = await screen.findByRole("article", { name: draftChoice.prompt });

    await user.click(within(card).getByRole("button", { expanded: false }));
    await user.click(within(card).getByRole("button", { name: "Activar" }));

    await waitFor(() => expect(within(card).getByText("Activa")).toBeTruthy());

    const active = screen.getByRole("article", { name: draftChoice.prompt });

    expect(within(active).queryByLabelText("Pregunta")).toBeNull();
    expect(within(active).getByRole("button", { name: "Cerrar" })).toBeTruthy();
    expect(store.writes).toEqual([{ method: "PATCH", body: { status: "active" } }]);
  });

  test("closing an active poll leaves it closed with its results and no way to activate it", async () => {
    const active = adminPoll(scalePoll(planning.id), "active", {
      count: 2,
      scale: [0, 1, 1, 0, 0],
    });

    const { user, store } = await openPolls([active]);
    const card = await screen.findByRole("article", { name: active.prompt });

    await user.click(within(card).getByRole("button", { name: "Cerrar" }));

    await waitFor(() => expect(within(card).getByText("Cerrada")).toBeTruthy());

    const closedCard = screen.getByRole("article", { name: active.prompt });

    expect(within(closedCard).getByRole("list", { name: "Resultados" })).toBeTruthy();
    expect(within(closedCard).queryByRole("button", { name: "Activar" })).toBeNull();
    expect(within(closedCard).queryByRole("button", { name: "Cerrar" })).toBeNull();
    expect(store.writes).toEqual([{ method: "PATCH", body: { status: "closed" } }]);
  });

  test("deleting asks for confirmation in any state, deletes it and removes it", async () => {
    const active = adminPoll(wordsPoll(planning.id), "active", { count: 0, words: [] });
    const { user, store } = await openPolls([active]);
    const card = await screen.findByRole("article", { name: active.prompt });

    await user.click(within(card).getByRole("button", { name: "Borrar" }));

    const confirm = screen.getByRole("alertdialog", { name: `¿Borrar "${active.prompt}"?` });

    expect(confirm.textContent).toContain(
      "Se borran sus respuestas y los estudiantes dejan de verla.",
    );

    await user.click(within(confirm).getByRole("button", { name: "Borrar" }));

    await waitFor(() => expect(screen.queryByRole("article", { name: active.prompt })).toBeNull());
    expect(store.writes).toEqual([{ method: "DELETE", body: active.id }]);
  });

  test("results show the count, the percentages and the cloud with its counts, without who voted", async () => {
    const closedWords = adminPoll(wordsPoll(planning.id), "closed", {
      count: 3,
      words: [
        { word: "rápido", count: 2 },
        { word: "caos", count: 1 },
      ],
    });

    const closedChoice = adminPoll(choicePoll(planning.id, 9), "closed", {
      count: 4,
      choice: [1, 3, 0, 0],
    });

    const { user } = await openPolls([closedWords, closedChoice]);

    const words = await screen.findByRole("article", { name: closedWords.prompt });
    const choice = screen.getByRole("article", { name: closedChoice.prompt });

    await user.click(within(words).getByRole("button", { expanded: false }));
    await user.click(within(choice).getByRole("button", { expanded: false }));

    expect(within(words).getByText("3 respuestas")).toBeTruthy();
    expect(
      within(within(words).getByRole("list", { name: "Resultados" }))
        .getAllByRole("listitem")
        .map((word) => word.textContent),
    ).toEqual(["rápido2", "caos1"]);
    expect(within(choice).getByText("4 respuestas")).toBeTruthy();
    expect(within(choice).getByText("75%")).toBeTruthy();
    expect(within(choice).queryByText(/✓/)).toBeNull();
  });
});

describe("session page: feedback polls", () => {
  const responses = [
    {
      id: "01KR0000000000000000000001",
      user: { id: "01KS0000000000000000000001", name: "Lucía", avatar: "fox" },
      pick: 5,
      text: "Excelente",
    },
    {
      id: "01KR0000000000000000000002",
      user: { id: "01KS0000000000000000000002", name: "Tomás", avatar: "panda" },
      pick: 3,
    },
    {
      id: "01KR0000000000000000000003",
      user: { id: "01KS0000000000000000000003", name: "Sofía", avatar: "owl" },
      pick: 1,
      text: "Muy largo\ncon dos líneas",
    },
  ] as const;

  const active = adminFeedback(planning.id, "active", responses);

  test("a new feedback takes only the question and saves as a draft without the responses button", async () => {
    const { user, store } = await openPolls();
    const card = await startNew(user, "Feedback");

    expect(within(card).getAllByRole("textbox")).toHaveLength(1);

    await user.type(within(card).getByLabelText("Pregunta"), "¿Cómo estuvo hoy?");
    await user.click(within(card).getByRole("button", { name: "Guardar borrador" }));

    const saved = await screen.findByRole("article", { name: "¿Cómo estuvo hoy?" });

    expect(within(saved).getByText("Borrador")).toBeTruthy();
    expect(within(saved).queryByRole("button", { name: "Ver las respuestas" })).toBeNull();
    expect(store.writes).toEqual([
      {
        method: "POST",
        body: { sessionId: planning.id, type: "feedback", prompt: "¿Cómo estuvo hoy?" },
      },
    ]);
  });

  test("an active feedback shows the count, a bar per pick with its emoji, the ends and the actions in order", async () => {
    await openPolls([active]);

    const card = await screen.findByRole("article", { name: active.prompt });
    const bars = within(card).getAllByRole("listitem");

    expect(within(card).getByText("3 respuestas")).toBeTruthy();
    expect(bars.map((bar) => bar.textContent)).toEqual(["1😞", "0😕", "1😐", "0🙂", "1😄"]);
    expect(within(card).getByText("No me gustó")).toBeTruthy();
    expect(within(card).getByText("Más o menos")).toBeTruthy();
    expect(within(card).getByText("Me gustó")).toBeTruthy();
    expect(
      within(card)
        .getAllByRole("button")
        .filter((button) => button.getAttribute("aria-expanded") == null)
        .map((button) => button.textContent),
    ).toEqual(["Ver las respuestas", "Borrar", "Cerrar"]);
  });

  test("Ver las respuestas opens a sheet with one row per student, in the order they arrive, closing with the X and Escape", async () => {
    const { user } = await openPolls([active]);
    const card = await screen.findByRole("article", { name: active.prompt });

    await user.click(within(card).getByRole("button", { name: "Ver las respuestas" }));

    const sheet = screen.getByRole("dialog", { name: "3 respuestas" });
    const rows = within(sheet).getAllByRole("listitem");

    expect(rows.map((row) => row.textContent)).toEqual([
      "🦊LucíaExcelente😄",
      "🐼TomásSin comentario.😐",
      "🦉SofíaMuy largo\ncon dos líneas😞",
    ]);

    await user.click(within(sheet).getByRole("button", { name: "Cerrar" }));

    expect(screen.queryByRole("dialog", { name: "3 respuestas" })).toBeNull();

    await user.click(within(card).getByRole("button", { name: "Ver las respuestas" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("dialog", { name: "3 respuestas" })).toBeNull();
  });

  test("a polls notice with the sheet open adds the new response and keeps the sheet open with the new title", async () => {
    const { user, socket } = await openPolls([active]);

    const card = await screen.findByRole("article", { name: active.prompt });

    await user.click(within(card).getByRole("button", { name: "Ver las respuestas" }));
    await waitFor(() => expect(socket.connections()).toBe(1));

    const more = adminFeedback(planning.id, "active", [
      ...responses,
      {
        id: "01KR0000000000000000000004",
        user: { id: "01KS0000000000000000000004", name: "Ana", avatar: "frog" },
        pick: 4,
        text: "Buena",
      },
    ]);

    server.use(getJson("/admin/polls", [more]));
    socket.send({ type: "changed", topic: "polls" });

    const sheet = await screen.findByRole("dialog", { name: "4 respuestas" });

    expect(within(sheet).getAllByRole("listitem")).toHaveLength(4);
    expect(within(sheet).getByText("Ana")).toBeTruthy();
  });

  test("a feedback without responses shows zeros and its sheet says there are none yet", async () => {
    const empty = adminFeedback(planning.id, "active", []);
    const { user } = await openPolls([empty]);
    const card = await screen.findByRole("article", { name: empty.prompt });

    expect(within(card).getByText("0 respuestas")).toBeTruthy();
    expect(
      within(card)
        .getAllByRole("listitem")
        .map((bar) => bar.textContent),
    ).toEqual(["0😞", "0😕", "0😐", "0🙂", "0😄"]);

    await user.click(within(card).getByRole("button", { name: "Ver las respuestas" }));

    const sheet = screen.getByRole("dialog", { name: "0 respuestas" });

    expect(within(sheet).getByText("Todavía no hay respuestas.")).toBeTruthy();
  });

  test("a closed feedback shows its bars and Ver las respuestas, without Cerrar or Activar", async () => {
    const closedOne = adminFeedback(planning.id, "closed", responses);
    const { user } = await openPolls([closedOne]);
    const card = await screen.findByRole("article", { name: closedOne.prompt });

    await user.click(within(card).getByRole("button", { expanded: false }));

    expect(within(card).getAllByRole("listitem")).toHaveLength(5);
    expect(within(card).getByRole("button", { name: "Ver las respuestas" })).toBeTruthy();
    expect(within(card).queryByRole("button", { name: "Cerrar" })).toBeNull();
    expect(within(card).queryByRole("button", { name: "Activar" })).toBeNull();
  });
});
