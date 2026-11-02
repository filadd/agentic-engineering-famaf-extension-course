import type { Question } from "@kurasu/contract/questions";
import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { asFeatured, planning, question } from "./fixtures/content.ts";
import { student } from "./fixtures/people.ts";
import { getJson } from "./helpers/api.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { questionStore } from "./helpers/question-store.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";

const featured = { ...asFeatured(planning), featuredQuestions: true };

const open = async (questions: ReadonlyArray<Question>, isWithQuestions = true) => {
  const store = questionStore(questions);

  server.use(
    getJson("/me", student),
    getJson("/sessions", [isWithQuestions ? featured : asFeatured(planning)]),
    getJson("/polls", []),
    ...store.handlers,
  );

  const rendered = await renderRoute("/");
  const card = await screen.findByRole("region", { name: planning.title });

  return { ...rendered, card, store };
};

const panelOf = (card: HTMLElement) => within(card).findByRole("heading", { name: "Preguntas" });

const rowNames = (card: HTMLElement) =>
  within(card)
    .getAllByRole("listitem")
    .map((row) => row.getAttribute("aria-label"));

const five = [
  question(1, planning.id, "Cinco votos", { votes: 5 }),
  question(2, planning.id, "Cuatro votos", { votes: 4 }),
  question(3, planning.id, "Tres votos", { votes: 3 }),
  question(4, planning.id, "Dos votos", { votes: 2 }),
  question(5, planning.id, "Una propia", { votes: 0, mine: true }),
];

describe("the questions panel of the featured card", () => {
  test("with the featured questions off the card has no panel and keeps the Preguntas link", async () => {
    const { card } = await open([question(1, planning.id, "Una")], false);

    expect(within(card).queryByRole("heading", { name: "Preguntas" })).toBeNull();
    expect(within(card).queryByLabelText("Hacé una pregunta")).toBeNull();
    expect(within(card).getByRole("button", { name: "Preguntas" })).toBeTruthy();
  });

  test("without questions it shows the field and invites to ask the first one", async () => {
    const { card } = await open([]);

    await panelOf(card);

    expect(within(card).getByLabelText("Hacé una pregunta")).toBeTruthy();
    expect(
      await within(card).findByText("Todavía no hay preguntas. Hacé la primera."),
    ).toBeTruthy();
  });

  test("with more than three questions it shows the three most voted and the own one, and offers the rest", async () => {
    const { card } = await open(five);

    await panelOf(card);
    await within(card).findByRole("listitem", { name: "Cinco votos" });

    expect(rowNames(card)).toEqual(["Cinco votos", "Cuatro votos", "Tres votos", "Una propia"]);
    expect(within(card).getByRole("button", { name: "Mostrar 1 pregunta más" })).toBeTruthy();
  });

  test("the toggle shows every question inside the card and folds them again", async () => {
    const { card, user } = await open(five);

    await user.click(await within(card).findByRole("button", { name: "Mostrar 1 pregunta más" }));

    expect(rowNames(card)).toEqual([
      "Cinco votos",
      "Cuatro votos",
      "Tres votos",
      "Dos votos",
      "Una propia",
    ]);

    await user.click(within(card).getByRole("button", { name: "Mostrar menos" }));

    expect(rowNames(card)).toEqual(["Cinco votos", "Cuatro votos", "Tres votos", "Una propia"]);
  });

  test("asking from the card posts the question and shows it as the student's own", async () => {
    const { card, user, store } = await open([question(1, planning.id, "Una", { votes: 2 })]);

    await user.type(await within(card).findByLabelText("Hacé una pregunta"), "¿Cómo seguimos?");
    await user.click(within(card).getByRole("button", { name: "Enviar" }));

    const asked = await within(card).findByRole("listitem", { name: "¿Cómo seguimos?" });

    expect(within(asked).getByText("Tuya")).toBeTruthy();
    expect(store.current().map((each) => each.body)).toContain("¿Cómo seguimos?");
  });

  test("a failed question stays written with the error under the field", async () => {
    const { card, user } = await open([]);

    server.use(failingRoute("post", "/questions"));

    const field = await within(card).findByLabelText("Hacé una pregunta");

    await user.type(field, "No sale");
    await user.click(within(card).getByRole("button", { name: "Enviar" }));

    expect(
      await within(card).findByText("No se pudo enviar tu pregunta. Probá de nuevo."),
    ).toBeTruthy();
    expect(field).toHaveProperty("value", "No sale");
  });

  test("voting marks the vote before the answer and reorders by votes, and taking it back subtracts it", async () => {
    const held = heldResponse("patch", `/questions/${question(2, planning.id, "").id}`);

    const { card, user } = await open([
      question(1, planning.id, "Primera", { votes: 3 }),
      question(2, planning.id, "Segunda", { votes: 3 }),
    ]);

    server.use(held.handler);

    const second = await within(card).findByRole("listitem", { name: "Segunda" });

    await user.click(within(second).getByRole("button", { name: "Votos: 3" }));

    await waitFor(() =>
      expect(
        within(second).getByRole("button", { name: "Votos: 4" }).getAttribute("aria-pressed"),
      ).toBe("true"),
    );

    held.release();

    await waitFor(() => expect(rowNames(card)).toEqual(["Segunda", "Primera"]));

    await user.click(within(card).getByRole("button", { name: "Votos: 4" }));

    expect(await within(card).findAllByRole("button", { name: "Votos: 3" })).toHaveLength(2);
  });

  test("a failed vote goes back and shows a toast", async () => {
    const { card, user } = await open([question(1, planning.id, "Primera", { votes: 3 })]);

    server.use(failingRoute("patch", `/questions/${question(1, planning.id, "").id}`));

    await user.click(await within(card).findByRole("button", { name: "Votos: 3" }));

    expect(await screen.findByText(/No se pudo/)).toBeTruthy();
    expect(
      within(card).getByRole("button", { name: "Votos: 3" }).getAttribute("aria-pressed"),
    ).toBe("false");
  });

  test("deleting the own question asks for confirmation and takes it away", async () => {
    const own = question(1, planning.id, "Para borrar", { mine: true });
    const { card, user, store } = await open([own]);

    const row = await within(card).findByRole("listitem", { name: own.body });

    await user.click(within(row).getByRole("button", { name: "Borrar tu pregunta" }));

    const confirm = screen.getByRole("alertdialog", { name: "¿Borrar tu pregunta?" });

    expect(store.current()).toHaveLength(1);

    await user.click(within(confirm).getByRole("button", { name: "Borrar" }));

    await waitFor(() =>
      expect(within(card).queryByRole("listitem", { name: own.body })).toBeNull(),
    );
    expect(store.current()).toEqual([]);
  });
});
