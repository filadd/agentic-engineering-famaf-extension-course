import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  asFeatured,
  choicePoll,
  planning,
  scalePoll,
  tooling,
  vibeCoding,
  voted,
  wordsPoll,
} from "./fixtures/content.ts";
import { questionStore } from "./helpers/question-store.ts";
import { student } from "./fixtures/people.ts";
import { icons } from "../src/ui/icons.ts";
import { getJson, url } from "./helpers/api.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";

afterEach(() => {
  vi.useRealTimers();
});

const pollsOf = (sessionId: string) => [choicePoll(sessionId)];

const cardsOfList = () => {
  const list = screen.getByRole("region", { name: "Todas las sesiones" });

  return {
    list,
    titles: within(list)
      .getAllByRole("article")
      .map((card) => card.getAttribute("aria-label")),
  };
};

const nodeNames = new Map<string | null | undefined, string>([
  [icons.check[0], "check"],
  [icons.star[0], "star"],
]);

const nodesOf = (list: HTMLElement) =>
  [...list.querySelectorAll("div.rounded-full")].map(
    (node) => nodeNames.get(node.querySelector("path")?.getAttribute("d")) ?? "empty",
  );

describe("/ home", () => {
  test("without enabled sessions there are no cards and no way into the classroom", async () => {
    server.use(getJson("/me", student), getJson("/sessions", []));

    await renderRoute("/");

    expect(await screen.findByText(/Todavía no hay sesiones habilitadas/)).toBeTruthy();
    expect(screen.queryByRole("article")).toBeNull();
    expect(screen.queryByRole("heading", { name: "Todas las sesiones" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Entrar al aula" })).toBeNull();
  });

  test("the featured card goes on top and Todas las sesiones lists every session in the teacher's order, with a check before the featured one, a star on it and an empty node after, and no numbers", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [vibeCoding, asFeatured(planning), tooling]),
      getJson("/polls", []),
    );

    await renderRoute("/");

    expect(await screen.findByRole("region", { name: planning.title })).toBeTruthy();

    const { list, titles } = cardsOfList();

    expect(titles).toEqual([vibeCoding.title, planning.title, tooling.title]);
    expect(nodesOf(list)).toEqual(["check", "star", "empty"]);
    expect(within(list).queryByText(/^[123]$/)).toBeNull();
    expect(within(list).getByRole("heading", { name: "Todas las sesiones" })).toBeTruthy();
  });

  test("the featured card in the list opens with Entrar al aula and its questions modal lets the student ask, and the other cards have no way into the classroom", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [asFeatured(vibeCoding), planning, tooling]),
      getJson("/polls", []),
      ...questionStore([]).handlers,
    );

    const { user } = await renderRoute("/");

    await screen.findByRole("region", { name: vibeCoding.title });

    const { list } = cardsOfList();

    await user.click(within(list).getByRole("button", { name: vibeCoding.title }));
    await user.click(within(list).getByRole("button", { name: "Preguntas" }));

    const sheet = screen.getByRole("dialog", { name: "Preguntas" });

    expect(within(sheet).getByLabelText("Hacé una pregunta")).toBeTruthy();

    await user.click(within(sheet).getByRole("button", { name: "Cerrar" }));

    expect(
      screen
        .getAllByRole("link", { name: "Entrar al aula" })
        .map((link) => link.getAttribute("href")),
    ).toEqual(["/aula", "/aula"]);

    await user.click(within(list).getByRole("button", { name: planning.title }));

    expect(within(list).queryByRole("link", { name: "Entrar al aula" })).toBeNull();
  });

  test("one session that is the featured one shows its card and the list with only that session", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [asFeatured(vibeCoding)]),
      getJson("/polls", []),
    );

    await renderRoute("/");

    const featured = await screen.findByRole("region", { name: vibeCoding.title });

    expect(within(featured).getByText(vibeCoding.summary)).toBeTruthy();
    expect(within(featured).getByRole("button", { name: "Material" })).toBeTruthy();
    expect(within(featured).getByRole("button", { name: "Encuestas" })).toBeTruthy();
    expect(within(featured).getByRole("button", { name: "Preguntas" })).toBeTruthy();
    expect(
      within(featured).getByRole("link", { name: "Entrar al aula" }).getAttribute("href"),
    ).toBe("/aula");
    expect(cardsOfList().titles).toEqual([vibeCoding.title]);
  });

  test("with no featured session there is no card on top, no check, no star and no way into the classroom", async () => {
    server.use(getJson("/me", student), getJson("/sessions", [vibeCoding, planning]));

    await renderRoute("/");

    const { list, titles } = await waitFor(cardsOfList);

    expect(titles).toEqual([vibeCoding.title, planning.title]);
    expect(screen.queryByRole("region", { name: planning.title })).toBeNull();
    expect(nodesOf(list)).toEqual(["empty", "empty"]);
    expect(screen.queryByRole("link", { name: "Entrar al aula" })).toBeNull();
  });

  test("the cards are folded and one opens at a time", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [vibeCoding, planning, asFeatured(tooling)]),
      getJson("/polls", []),
    );

    const { user } = await renderRoute("/");

    await screen.findByRole("region", { name: tooling.title });

    const { list } = cardsOfList();

    expect(within(list).queryByText(planning.summary)).toBeNull();
    expect(within(list).queryByText(vibeCoding.summary)).toBeNull();

    await user.click(within(list).getByRole("button", { name: planning.title }));

    expect(within(list).getByText(planning.summary)).toBeTruthy();

    await user.click(within(list).getByRole("button", { name: vibeCoding.title }));

    expect(within(list).getByText(vibeCoding.summary)).toBeTruthy();
    expect(within(list).queryByText(planning.summary)).toBeNull();
  });

  test("a card's caret points down while folded and up while open", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [vibeCoding, asFeatured(planning)]),
      getJson("/polls", []),
    );

    const { user } = await renderRoute("/");

    const card = await screen.findByRole("article", { name: vibeCoding.title });
    const list = screen.getByRole("region", { name: "Todas las sesiones" });
    const caret = () => card.querySelector("button[aria-hidden] path")?.getAttribute("d");

    expect(within(list).getByRole("heading", { name: "Todas las sesiones" })).toBeTruthy();
    expect(caret()).toBe(icons["chevron-down"][0]);

    await user.click(within(card).getByRole("button", { name: vibeCoding.title }));

    expect(caret()).toBe(icons["chevron-up"][0]);
  });

  test("the featured session shows one card per active poll: the form before voting, the results after", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [asFeatured(planning)]),
      getJson("/polls", [
        choicePoll(planning.id),
        voted(scalePoll(planning.id), { scale: 4 }, { count: 3, scale: [0, 1, 0, 2, 0] }),
        wordsPoll(planning.id),
      ]),
    );

    await renderRoute("/");

    const choice = await screen.findByRole("article", { name: choicePoll(planning.id).prompt });
    const scale = screen.getByRole("article", { name: scalePoll(planning.id).prompt });
    const words = screen.getByRole("article", { name: wordsPoll(planning.id).prompt });

    expect(within(choice).getByRole("button", { name: "La mitad" })).toBeTruthy();
    expect(within(scale).getByRole("list", { name: "Resultados" })).toBeTruthy();
    expect(within(scale).getByText("Votaste · 3 respuestas")).toBeTruthy();
    expect(within(words).getByLabelText("Tus palabras")).toBeTruthy();
  });

  test("the active polls asked for are the featured session's", async () => {
    const asked: Array<string> = [];

    server.use(
      getJson("/me", student),
      getJson("/sessions", [vibeCoding, asFeatured(planning)]),
      http.get(url("/polls"), ({ request }) => {
        const query = new URL(request.url).searchParams;

        asked.push(`${query.get("sessionId")}:${query.get("status")}`);

        return HttpResponse.json(pollsOf(planning.id));
      }),
    );

    await renderRoute("/");
    await screen.findByRole("article", { name: choicePoll(planning.id).prompt });

    expect(asked).toEqual([`${planning.id}:active`]);
  });

  test("after five minutes it asks again for the sessions and the polls of the featured session", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    let sessionRequests = 0;
    let pollRequests = 0;

    server.use(
      getJson("/me", student),
      http.get(url("/sessions"), () => {
        sessionRequests += 1;

        return HttpResponse.json([vibeCoding, asFeatured(planning)]);
      }),
      http.get(url("/polls"), () => {
        pollRequests += 1;

        return HttpResponse.json([choicePoll(planning.id)]);
      }),
    );

    await renderRoute("/");

    await screen.findByRole("article", { name: choicePoll(planning.id).prompt });

    expect([sessionRequests, pollRequests]).toEqual([1, 1]);

    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

    await waitFor(() => expect([sessionRequests, pollRequests]).toEqual([2, 2]));
  });
});

// Opens the home with three enabled sessions, the second one featured, and
// returns whether each card of the list is open and the spy on scrollIntoView.
const openHome = async (path: string) => {
  const scrolls = vi.spyOn(HTMLElement.prototype, "scrollIntoView");

  server.use(
    getJson("/me", student),
    getJson("/sessions", [vibeCoding, asFeatured(planning), tooling]),
    getJson("/polls", []),
  );

  await renderRoute(path);
  await screen.findByRole("region", { name: planning.title });

  const list = screen.getByRole("region", { name: "Todas las sesiones" });

  const expanded = within(list)
    .getAllByRole("article")
    .map((card) => [
      card.getAttribute("aria-label"),
      within(card)
        .getByRole("button", { name: card.getAttribute("aria-label") ?? "" })
        .getAttribute("aria-expanded"),
    ]);

  return { expanded, scrolls };
};

describe("/ home with ?sesion=", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("the id of another session opens its card alone and centres it", async () => {
    const { expanded, scrolls } = await openHome(`/?sesion=${vibeCoding.id}`);

    expect(expanded).toEqual([
      [vibeCoding.title, "true"],
      [planning.title, "false"],
      [tooling.title, "false"],
    ]);
    expect(scrolls).toHaveBeenCalledWith({ block: "center" });
    expect(scrolls.mock.contexts[0]).toBe(
      within(screen.getByRole("region", { name: "Todas las sesiones" })).getByRole("article", {
        name: vibeCoding.title,
      }),
    );
  });

  test("the id of the featured session opens its card in the list", async () => {
    const { expanded } = await openHome(`/?sesion=${planning.id}`);

    expect(expanded).toEqual([
      [vibeCoding.title, "false"],
      [planning.title, "true"],
      [tooling.title, "false"],
    ]);
  });

  test("an unknown id opens no card and shows no error", async () => {
    const { expanded } = await openHome("/?sesion=01KY99999999999999999999999");

    expect(expanded).toEqual([
      [vibeCoding.title, "false"],
      [planning.title, "false"],
      [tooling.title, "false"],
    ]);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
