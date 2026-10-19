import type { Poll } from "@kurasu/contract/polls";
import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import { choicePoll, planning, scalePoll, voted, wordsPoll } from "./fixtures/content.ts";
import { student } from "./fixtures/people.ts";
import { apiError, getJson, url } from "./helpers/api.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { voteHandler } from "./helpers/vote-handlers.ts";

const choice = choicePoll(planning.id);
const scale = scalePoll(planning.id);
const words = wordsPoll(planning.id);

const openHome = async (poll: Poll) => {
  const { user } = await renderRoute("/");

  return { user, card: await screen.findByRole("article", { name: poll.prompt }) };
};

const withPolls = (...polls: ReadonlyArray<Poll>) =>
  server.use(getJson("/me", student), getJson("/sessions", [planning]), getJson("/polls", polls));

describe("voting on the highlighted card", () => {
  test("a choice poll takes one option and then shows the percentages and the count", async () => {
    const vote = voteHandler((myResponse) =>
      voted(choice, myResponse, { count: 4, choice: [1, 2, 1, 0] }),
    );

    withPolls(choice);
    server.use(vote.handler);

    const { user, card } = await openHome(choice);

    await user.click(within(card).getByRole("button", { name: "Algo" }));

    const results = await within(card).findByRole("list", { name: "Resultados" });

    expect(vote.votes).toEqual([{ choice: 1 }]);
    expect(within(card).getByText("Votaste · 4 respuestas")).toBeTruthy();
    expect(
      within(results)
        .getAllByRole("listitem")
        .map((row) => row.textContent),
    ).toEqual(["Nada25%", "✓ Algo50%", "La mitad25%", "Casi todo0%"]);
  });

  test("a scale poll offers 1 to 5 with the labels of the ends and then shows the distribution", async () => {
    const vote = voteHandler((myResponse) =>
      voted(scale, myResponse, { count: 3, scale: [0, 1, 0, 2, 0] }),
    );

    withPolls(scale);
    server.use(vote.handler);

    const { user, card } = await openHome(scale);

    expect(within(card).getByText("Nada cómodo")).toBeTruthy();
    expect(within(card).getByText("Muy cómodo")).toBeTruthy();

    await user.click(within(card).getByRole("button", { name: "4" }));

    const results = await within(card).findByRole("list", { name: "Resultados" });
    const bars = within(results).getAllByRole("listitem");

    expect(vote.votes).toEqual([{ scale: 4 }]);
    expect(bars.map((bar) => bar.textContent)).toEqual(["01", "12", "03", "24", "05"]);
    expect(bars[3]?.getAttribute("aria-current")).toBe("true");
  });

  test("a word cloud takes words separated by commas and then shows the cloud", async () => {
    const vote = voteHandler((myResponse) =>
      voted(words, myResponse, {
        count: 2,
        words: [
          { word: "rápido", count: 2 },
          { word: "caos", count: 1 },
        ],
      }),
    );

    withPolls(words);
    server.use(vote.handler);

    const { user, card } = await openHome(words);

    await user.type(within(card).getByLabelText("Tus palabras"), "Rápido, caos,");
    await user.click(within(card).getByRole("button", { name: "Enviar" }));

    const cloud = await within(card).findByRole("list", { name: "Resultados" });

    expect(vote.votes).toEqual([{ words: ["rápido", "caos"] }]);
    expect(within(cloud).getByText("rápido")).toBeTruthy();
    expect(within(card).getByText("Tus palabras: rápido, caos")).toBeTruthy();
  });

  test("changing the vote returns to the form with the previous vote marked and takes a new one", async () => {
    const vote = voteHandler((myResponse) =>
      voted(choice, myResponse, { count: 2, choice: [0, 0, 2, 0] }),
    );

    withPolls(voted(choice, { choice: 1 }, { count: 2, choice: [0, 2, 0, 0] }));
    server.use(vote.handler);

    const { user, card } = await openHome(choice);

    await user.click(within(card).getByRole("button", { name: "Cambiar mi voto" }));

    expect(within(card).getByRole("button", { name: "Algo" }).getAttribute("aria-pressed")).toBe(
      "true",
    );

    await user.click(within(card).getByRole("button", { name: "La mitad" }));

    const results = await within(card).findByRole("list", { name: "Resultados" });

    expect(vote.votes).toEqual([{ choice: 2 }]);
    expect(within(results).getByText("✓ La mitad")).toBeTruthy();
  });

  test("cancelling the change shows the results with the previous vote", async () => {
    withPolls(voted(scale, { scale: 2 }, { count: 1, scale: [0, 1, 0, 0, 0] }));

    const { user, card } = await openHome(scale);

    await user.click(within(card).getByRole("button", { name: "Cambiar mi voto" }));

    expect(within(card).queryByRole("list", { name: "Resultados" })).toBeNull();

    await user.click(within(card).getByRole("button", { name: "Cancelar" }));

    const bars = within(within(card).getByRole("list", { name: "Resultados" })).getAllByRole(
      "listitem",
    );

    expect(bars[1]?.getAttribute("aria-current")).toBe("true");
  });

  test("cancelling in the word cloud closes the field", async () => {
    withPolls(
      voted(words, { words: ["contexto"] }, { count: 1, words: [{ word: "contexto", count: 1 }] }),
    );

    const { user, card } = await openHome(words);

    await user.click(within(card).getByRole("button", { name: "Sumar más palabras" }));

    expect(within(card).getByLabelText("Más palabras")).toBeTruthy();

    await user.click(within(card).getByRole("button", { name: "Cancelar" }));

    expect(within(card).queryByLabelText("Más palabras")).toBeNull();
  });

  test("adding words sends the previous ones and the new ones", async () => {
    const vote = voteHandler((myResponse) =>
      voted(words, myResponse, {
        count: 1,
        words: [
          { word: "contexto", count: 1 },
          { word: "loop", count: 1 },
        ],
      }),
    );

    withPolls(
      voted(words, { words: ["contexto"] }, { count: 1, words: [{ word: "contexto", count: 1 }] }),
    );
    server.use(vote.handler);

    const { user, card } = await openHome(words);

    await user.click(within(card).getByRole("button", { name: "Sumar más palabras" }));
    await user.type(within(card).getByLabelText("Más palabras"), "loop");
    await user.click(within(card).getByRole("button", { name: "Enviar" }));

    await waitFor(() => expect(vote.votes).toEqual([{ words: ["contexto", "loop"] }]));
    expect(await within(card).findByText("Tus palabras: contexto, loop")).toBeTruthy();
  });

  test("a poll closed while voting shows a message, is asked for again and leaves the active ones", async () => {
    let pollRequests = 0;

    server.use(
      getJson("/me", student),
      getJson("/sessions", [planning]),
      http.get(url("/polls"), () => {
        pollRequests += 1;

        return HttpResponse.json(pollRequests === 1 ? [choice] : []);
      }),
      http.patch(url("/polls/:id"), () => apiError("PollNotActive")),
    );

    const { user, card } = await openHome(choice);

    await user.click(within(card).getByRole("button", { name: "Algo" }));

    expect((await screen.findByRole("status")).textContent).toContain("cerró esa encuesta");
    await waitFor(() => expect(screen.queryByRole("article", { name: choice.prompt })).toBeNull());
    expect(pollRequests).toBe(2);
  });
});
