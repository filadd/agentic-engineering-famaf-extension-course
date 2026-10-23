import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, test, vi } from "vitest";

import {
  choicePoll,
  planning,
  scalePoll,
  tooling,
  vibeCoding,
  voted,
  wordsPoll,
} from "./fixtures/content.ts";
import { student } from "./fixtures/people.ts";
import { icons } from "../src/ui/icons.ts";
import { getJson, url } from "./helpers/api.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";

afterEach(() => {
  vi.useRealTimers();
});

describe("/ home", () => {
  test("without enabled sessions there are no cards and no way into the classroom", async () => {
    server.use(getJson("/me", student), getJson("/sessions", []), getJson("/polls", []));

    await renderRoute("/");

    expect(await screen.findByText(/Todavía no hay sesiones habilitadas/)).toBeTruthy();
    expect(screen.queryByRole("article")).toBeNull();
    expect(screen.queryByRole("link", { name: "Entrar al aula" })).toBeNull();
  });

  test("one session shows it highlighted and open, without the list of all sessions", async () => {
    server.use(getJson("/me", student), getJson("/sessions", [vibeCoding]), getJson("/polls", []));

    await renderRoute("/");

    const highlighted = await screen.findByRole("region", { name: vibeCoding.title });

    expect(within(highlighted).getByText(vibeCoding.summary)).toBeTruthy();
    expect(within(highlighted).getByRole("button", { name: "Material" })).toBeTruthy();
    expect(within(highlighted).getByRole("button", { name: "Encuestas" })).toBeTruthy();
    expect(within(highlighted).getByRole("button", { name: "Preguntas" })).toBeTruthy();
    expect(
      within(highlighted).getByRole("link", { name: "Entrar al aula" }).getAttribute("href"),
    ).toBe("/aula");
    expect(screen.queryByRole("heading", { name: "Sesiones anteriores" })).toBeNull();
  });

  test("several sessions highlight the last one and fold the rest, newest first, one open at a time", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [vibeCoding, planning, tooling]),
      getJson("/polls", []),
    );

    const { user } = await renderRoute("/");

    expect(await screen.findByRole("region", { name: tooling.title })).toBeTruthy();

    const rail = screen.getByRole("region", { name: "Sesiones anteriores" });
    const cards = within(rail).getAllByRole("article");

    expect(cards.map((card) => card.getAttribute("aria-label"))).toEqual([
      planning.title,
      vibeCoding.title,
    ]);
    expect(within(rail).queryByText(planning.summary)).toBeNull();
    expect(within(rail).queryByText(vibeCoding.summary)).toBeNull();

    await user.click(within(rail).getByRole("button", { name: planning.title }));

    expect(within(rail).getByText(planning.summary)).toBeTruthy();

    await user.click(within(rail).getByRole("button", { name: vibeCoding.title }));

    expect(within(rail).getByText(vibeCoding.summary)).toBeTruthy();
    expect(within(rail).queryByText(planning.summary)).toBeNull();
    expect(within(rail).queryByRole("link", { name: "Entrar al aula" })).toBeNull();
  });

  test("an earlier card's caret points down while folded and up while open", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [vibeCoding, planning]),
      getJson("/polls", []),
    );

    const { user } = await renderRoute("/");

    const card = await screen.findByRole("article", { name: vibeCoding.title });
    const rail = screen.getByRole("region", { name: "Sesiones anteriores" });
    const caret = () => card.querySelector("button[aria-hidden] path")?.getAttribute("d");

    expect(within(rail).getByRole("heading", { name: "Sesiones anteriores" })).toBeTruthy();
    expect(caret()).toBe(icons["chevron-down"][0]);

    await user.click(within(card).getByRole("button", { name: vibeCoding.title }));

    expect(caret()).toBe(icons["chevron-up"][0]);
  });

  test("the highlighted session shows one card per active poll: the form before voting, the results after", async () => {
    server.use(
      getJson("/me", student),
      getJson("/sessions", [planning]),
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

  test("after five minutes it asks again for the sessions and the polls", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    let sessionRequests = 0;
    let pollRequests = 0;

    server.use(
      getJson("/me", student),
      http.get(url("/sessions"), () => {
        sessionRequests += 1;

        return HttpResponse.json([vibeCoding, planning]);
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

// Opens the home with three enabled sessions, so two are earlier ones, and
// returns whether each earlier card is open and the spy on scrollIntoView.
const openHome = async (path: string) => {
  const scrolls = vi.spyOn(HTMLElement.prototype, "scrollIntoView");

  server.use(
    getJson("/me", student),
    getJson("/sessions", [vibeCoding, planning, tooling]),
    getJson("/polls", []),
  );

  await renderRoute(path);
  await screen.findByRole("region", { name: tooling.title });

  const rail = screen.getByRole("region", { name: "Sesiones anteriores" });

  const expanded = within(rail)
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

  test("the id of an earlier session opens its card alone and centres it", async () => {
    const { expanded, scrolls } = await openHome(`/?sesion=${vibeCoding.id}`);

    expect(expanded).toEqual([
      [planning.title, "false"],
      [vibeCoding.title, "true"],
    ]);
    expect(scrolls).toHaveBeenCalledWith({ block: "center" });
    expect(scrolls.mock.contexts[0]).toBe(screen.getByRole("article", { name: vibeCoding.title }));
  });

  test("the id of the highlighted session opens no earlier card", async () => {
    const { expanded } = await openHome(`/?sesion=${tooling.id}`);

    expect(expanded).toEqual([
      [planning.title, "false"],
      [vibeCoding.title, "false"],
    ]);
  });

  test("an unknown id opens no earlier card and shows no error", async () => {
    const { expanded } = await openHome("/?sesion=01KY99999999999999999999999");

    expect(expanded).toEqual([
      [planning.title, "false"],
      [vibeCoding.title, "false"],
    ]);
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
