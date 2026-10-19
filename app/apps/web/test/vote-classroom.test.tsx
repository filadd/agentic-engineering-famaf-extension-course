import type { Poll } from "@kurasu/contract/polls";
import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import {
  choicePoll,
  closed,
  planning,
  scalePoll,
  sessionDetail,
  voted,
  wordsPoll,
} from "./fixtures/content.ts";
import { student, teacher } from "./fixtures/people.ts";
import { apiError, url } from "./helpers/api.ts";
import { classroomSocket } from "./helpers/classroom-socket.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { studentClassroom } from "./helpers/student-classroom.ts";
import { voteHandler } from "./helpers/vote-handlers.ts";

const choice = choicePoll(planning.id);
const scale = scalePoll(planning.id);
const words = wordsPoll(planning.id);

const enter = async (activePolls: ReadonlyArray<Poll>, closedPolls: ReadonlyArray<Poll> = []) => {
  server.use(
    ...studentClassroom({
      session: sessionDetail(planning),
      slides: null,
      activePolls,
      closedPolls,
    }),
    classroomSocket({ people: [teacher, student] }).handler,
  );

  const { user } = await renderRoute("/aula");
  const panel = await screen.findByRole("tabpanel");

  return { user, panel };
};

const cardIn = (panel: HTMLElement, poll: Poll) =>
  within(panel).findByRole("article", { name: poll.prompt });

describe("voting in the classroom's Encuestas tab", () => {
  test("a choice poll takes one option and shows the percentages and the count", async () => {
    const vote = voteHandler((myResponse) =>
      voted(choice, myResponse, { count: 2, choice: [0, 1, 1, 0] }),
    );

    server.use(vote.handler);

    const { user, panel } = await enter([choice]);
    const card = await cardIn(panel, choice);

    await user.click(within(card).getByRole("button", { name: "La mitad" }));

    const results = await within(card).findByRole("list", { name: "Resultados" });

    expect(vote.votes).toEqual([{ choice: 2 }]);
    expect(within(card).getByText("Votaste · 2 respuestas")).toBeTruthy();
    expect(within(results).getByText("✓ La mitad")).toBeTruthy();
    expect(within(results).getAllByText("50%")).toHaveLength(2);
  });

  test("a scale poll takes a value from 1 to 5 and shows the distribution", async () => {
    const vote = voteHandler((myResponse) =>
      voted(scale, myResponse, { count: 1, scale: [0, 0, 0, 0, 1] }),
    );

    server.use(vote.handler);

    const { user, panel } = await enter([scale]);
    const card = await cardIn(panel, scale);

    expect(within(card).getByText("Muy cómodo")).toBeTruthy();

    await user.click(within(card).getByRole("button", { name: "5" }));

    const bars = within(await within(card).findByRole("list", { name: "Resultados" })).getAllByRole(
      "listitem",
    );

    expect(vote.votes).toEqual([{ scale: 5 }]);
    expect(bars[4]?.getAttribute("aria-current")).toBe("true");
  });

  test("a word cloud takes words separated by commas and shows the cloud", async () => {
    const vote = voteHandler((myResponse) =>
      voted(words, myResponse, { count: 1, words: [{ word: "contexto", count: 1 }] }),
    );

    server.use(vote.handler);

    const { user, panel } = await enter([words]);
    const card = await cardIn(panel, words);

    await user.type(within(card).getByLabelText("Tus palabras"), "contexto");
    await user.click(within(card).getByRole("button", { name: "Enviar" }));

    expect(await within(card).findByRole("list", { name: "Resultados" })).toBeTruthy();
    expect(vote.votes).toEqual([{ words: ["contexto"] }]);
  });

  test("changing the vote marks the previous one and takes the new one", async () => {
    const vote = voteHandler((myResponse) =>
      voted(choice, myResponse, { count: 1, choice: [1, 0, 0, 0] }),
    );

    server.use(vote.handler);

    const { user, panel } = await enter([
      voted(choice, { choice: 3 }, { count: 1, choice: [0, 0, 0, 1] }),
    ]);

    const card = await cardIn(panel, choice);

    await user.click(within(card).getByRole("button", { name: "Cambiar mi voto" }));

    expect(
      within(card).getByRole("button", { name: "Casi todo" }).getAttribute("aria-pressed"),
    ).toBe("true");

    await user.click(within(card).getByRole("button", { name: "Nada" }));

    expect(await within(card).findByText("✓ Nada")).toBeTruthy();
    expect(vote.votes).toEqual([{ choice: 0 }]);
  });

  test("a choice vote counts in the results before the answer, and changing it takes the previous one away", async () => {
    const { user, panel } = await enter([choice]);
    const card = await cardIn(panel, choice);
    const first = heldResponse("patch", `/polls/${choice.id}`);

    server.use(first.handler);
    await user.click(within(card).getByRole("button", { name: "La mitad" }));

    const results = await within(card).findByRole("list", { name: "Resultados" });

    expect(within(results).getByText("✓ La mitad")).toBeTruthy();
    expect(within(card).getByText("Votaste · 1 respuesta")).toBeTruthy();

    first.release(
      HttpResponse.json(voted(choice, { choice: 2 }, { count: 3, choice: [1, 1, 1, 0] })),
    );

    expect(await within(card).findByText("Votaste · 3 respuestas")).toBeTruthy();

    const second = heldResponse("patch", `/polls/${choice.id}`);

    server.use(second.handler);
    await user.click(within(card).getByRole("button", { name: "Cambiar mi voto" }));
    await user.click(within(card).getByRole("button", { name: "Nada" }));

    const changed = await within(card).findByRole("list", { name: "Resultados" });

    expect(within(changed).getByText("✓ Nada")).toBeTruthy();
    expect(
      within(changed)
        .getAllByRole("listitem")
        .map((option) => option.lastElementChild?.textContent),
    ).toEqual(["67%", "33%", "0%", "0%"]);
    expect(within(card).getByText("Votaste · 3 respuestas")).toBeTruthy();

    second.release(
      HttpResponse.json(voted(choice, { choice: 0 }, { count: 3, choice: [2, 1, 0, 0] })),
    );
  });

  test("a failed vote puts the previous vote and results back and shows a toast", async () => {
    const { user, panel } = await enter([
      voted(choice, { choice: 3 }, { count: 2, choice: [1, 0, 0, 1] }),
    ]);

    const card = await cardIn(panel, choice);

    server.use(failingRoute("patch", `/polls/${choice.id}`));
    await user.click(within(card).getByRole("button", { name: "Cambiar mi voto" }));
    await user.click(within(card).getByRole("button", { name: "Nada" }));

    expect(await screen.findByText("No se pudo registrar tu voto.")).toBeTruthy();

    const results = await within(card).findByRole("list", { name: "Resultados" });

    expect(within(results).getByText("✓ Casi todo")).toBeTruthy();
    expect(
      within(results)
        .getAllByRole("listitem")
        .map((option) => option.lastElementChild?.textContent),
    ).toEqual(["50%", "0%", "0%", "50%"]);
  });

  test("cancelling the change shows the results with the previous vote", async () => {
    const { user, panel } = await enter([
      voted(scale, { scale: 3 }, { count: 1, scale: [0, 0, 1, 0, 0] }),
    ]);

    const card = await cardIn(panel, scale);

    await user.click(within(card).getByRole("button", { name: "Cambiar mi voto" }));
    await user.click(within(card).getByRole("button", { name: "Cancelar" }));

    const bars = within(within(card).getByRole("list", { name: "Resultados" })).getAllByRole(
      "listitem",
    );

    expect(bars[2]?.getAttribute("aria-current")).toBe("true");
  });

  test("adding words sends the previous ones and the new ones", async () => {
    const vote = voteHandler((myResponse) =>
      voted(words, myResponse, {
        count: 1,
        words: [
          { word: "caos", count: 1 },
          { word: "magia", count: 1 },
        ],
      }),
    );

    server.use(vote.handler);

    const { user, panel } = await enter([
      voted(words, { words: ["caos"] }, { count: 1, words: [{ word: "caos", count: 1 }] }),
    ]);

    const card = await cardIn(panel, words);

    await user.click(within(card).getByRole("button", { name: "Sumar más palabras" }));
    await user.type(within(card).getByLabelText("Más palabras"), "magia");
    await user.click(within(card).getByRole("button", { name: "Enviar" }));

    await waitFor(() => expect(vote.votes).toEqual([{ words: ["caos", "magia"] }]));
  });

  test("a poll closed while voting moves to Cerradas", async () => {
    let closedNow = false;

    const { user, panel } = await enter([choice]);

    server.use(
      http.patch(url("/polls/:id"), () => {
        closedNow = true;

        return apiError("PollNotActive");
      }),
      http.get(url("/polls"), ({ request }) => {
        const status = new URL(request.url).searchParams.get("status");

        if (status === "closed") {
          return HttpResponse.json(
            closedNow ? [closed(choice, null, { count: 3, choice: [1, 1, 1, 0] })] : [],
          );
        }

        return HttpResponse.json(closedNow ? [] : [choice]);
      }),
    );

    const card = await cardIn(panel, choice);

    await user.click(within(card).getByRole("button", { name: "Algo" }));

    const closedSection = within(panel).getByRole("region", { name: "Cerradas" });

    expect(await within(closedSection).findByRole("article", { name: choice.prompt })).toBeTruthy();
    expect(within(panel).getByText("No hay encuestas activas.")).toBeTruthy();
  });

  test("closed polls are folded and show their results with the own answer marked", async () => {
    const { user, panel } = await enter(
      [],
      [closed(choice, { choice: 1 }, { count: 2, choice: [1, 1, 0, 0] })],
    );

    const closedSection = within(panel).getByRole("region", { name: "Cerradas" });
    const card = await within(closedSection).findByRole("article", { name: choice.prompt });

    expect(within(card).queryByRole("list", { name: "Resultados" })).toBeNull();

    await user.click(within(card).getByRole("button", { expanded: false }));

    expect(within(card).getByText("✓ Algo")).toBeTruthy();
  });
});
