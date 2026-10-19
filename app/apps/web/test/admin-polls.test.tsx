import type { AdminPoll } from "@kurasu/contract/polls";
import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import {
  adminPoll,
  choicePoll,
  planning,
  scalePoll,
  sessionDetail,
  wordsPoll,
} from "./fixtures/content.ts";
import { pollStore } from "./helpers/poll-store.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const openPolls = async (polls: ReadonlyArray<AdminPoll> = []) => {
  const store = pollStore(polls);
  const page = teacherSession({ sessions: [{ ...sessionDetail(planning), enabled: true }] });

  server.use(...store.handlers, ...page.handlers);

  const rendered = await renderRoute(`/admin/sesiones/${planning.id}?tab=encuestas`);

  await screen.findByRole("heading", { name: "Encuestas" });

  return { ...rendered, store };
};

const startNew = async (user: Awaited<ReturnType<typeof renderRoute>>["user"], type: string) => {
  await user.click(screen.getByRole("button", { name: "Nueva encuesta" }));
  await user.click(within(screen.getByRole("menu")).getByRole("menuitem", { name: type }));

  return screen.getByRole("article", { name: "Nueva encuesta" });
};

const draftChoice = adminPoll(choicePoll(planning.id), "draft", { count: 0 });

describe("session page: polls", () => {
  test("a new choice poll starts with two options, takes up to ten and saves as a draft", async () => {
    const { user, store } = await openPolls();
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
