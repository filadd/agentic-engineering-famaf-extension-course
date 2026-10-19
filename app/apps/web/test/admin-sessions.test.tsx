import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import { planning, sessionDetail, tooling, vibeCoding } from "./fixtures/content.ts";
import { teacher } from "./fixtures/people.ts";
import { apiError, getJson, url } from "./helpers/api.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { sessionStore } from "./helpers/session-store.ts";

const enabled = (summary: typeof vibeCoding, on: boolean) => ({
  ...sessionDetail(summary),
  enabled: on,
});

const course = () => [enabled(vibeCoding, true), enabled(planning, true), enabled(tooling, false)];

const openAdmin = async (store = sessionStore(course())) => {
  server.use(getJson("/me", teacher), ...store.handlers);

  const rendered = await renderRoute("/admin");
  const rail = await screen.findByRole("region", { name: "Todas las sesiones" });

  await within(rail).findAllByRole("article");

  return { ...rendered, rail, store };
};

const titlesIn = (rail: HTMLElement) =>
  within(rail)
    .getAllByRole("article")
    .map((card) => card.getAttribute("aria-label"));

describe("/admin", () => {
  test("the list shows each card with its number and whether it is enabled, and the new session card last", async () => {
    const { rail } = await openAdmin();

    expect(titlesIn(rail)).toEqual([vibeCoding.title, planning.title, tooling.title]);
    expect(within(rail).getByLabelText("Sesión 1")).toBeTruthy();
    expect(within(rail).getByLabelText("Sesión 3").textContent).toBe("3");
    expect(
      within(rail)
        .getAllByRole("article")
        .map((card) => within(card).getByText(/abilitada$/).textContent),
    ).toEqual(["Habilitada", "Habilitada", "Deshabilitada"]);

    const buttons = within(rail).getAllByRole("button");

    expect(buttons.at(-1)?.textContent).toBe("Nueva sesión");
  });

  test("creating a session asks for a title and a summary and adds it last, disabled", async () => {
    const { user, rail, store } = await openAdmin();

    await user.click(within(rail).getByRole("button", { name: "Nueva sesión" }));

    const dialog = screen.getByRole("dialog", { name: "Nueva sesión" });
    const create = within(dialog).getByRole("button", { name: "Crear sesión" });

    expect(create).toHaveProperty("disabled", true);

    await user.type(within(dialog).getByLabelText("Título"), "Testing con agentes");
    await user.type(within(dialog).getByLabelText("Resumen"), "Cómo pedir tests.");
    await user.click(create);

    await waitFor(() => expect(titlesIn(rail).at(-1)).toBe("Testing con agentes"));
    expect(store.writes).toEqual([
      { method: "POST", body: { title: "Testing con agentes", summary: "Cómo pedir tests." } },
    ]);

    const created = within(rail).getByRole("article", { name: "Testing con agentes" });

    expect(within(created).getByText("Deshabilitada")).toBeTruthy();
  });

  test("the new session sheet asks for the title and the summary, without an explanation", async () => {
    const { user, rail } = await openAdmin();

    await user.click(within(rail).getByRole("button", { name: "Nueva sesión" }));

    const dialog = screen.getByRole("dialog", { name: "Nueva sesión" });

    expect(within(dialog).getByLabelText("Título")).toBeTruthy();
    expect(within(dialog).getByLabelText("Resumen")).toBeTruthy();
    expect(dialog.querySelector("p")).toBeNull();
  });

  test("dragging a card reorders the list on drop and puts the whole order", async () => {
    const { rail, store } = await openAdmin();

    const cards = within(rail).getAllByRole("article");
    const dragged = cards[2]?.parentElement;
    const target = cards[0]?.parentElement;

    if (dragged == null || target == null) {
      throw new Error("The cards are not draggable");
    }

    fireEvent.dragStart(dragged);
    fireEvent.dragOver(target);
    fireEvent.drop(target);

    await waitFor(() =>
      expect(titlesIn(rail)).toEqual([tooling.title, vibeCoding.title, planning.title]),
    );
    await waitFor(() =>
      expect(store.writes).toEqual([
        { method: "PUT", body: [tooling.id, vibeCoding.id, planning.id] },
      ]),
    );
  });

  test("a failed reorder goes back to the server's order", async () => {
    const { rail } = await openAdmin();

    server.use(http.put(url("/admin/session-order"), () => apiError("OrderMismatch")));

    const cards = within(rail).getAllByRole("article");

    fireEvent.dragStart(cards[2]?.parentElement ?? rail);
    fireEvent.dragOver(cards[0]?.parentElement ?? rail);
    fireEvent.drop(cards[0]?.parentElement ?? rail);

    await waitFor(() =>
      expect(titlesIn(rail)).toEqual([vibeCoding.title, planning.title, tooling.title]),
    );
  });

  test("opening a session goes to its page", async () => {
    const { user, router } = await openAdmin();

    server.use(
      getJson("/admin/materials", []),
      getJson("/admin/polls", []),
      getJson("/admin/questions", []),
      getJson("/admin/raised-hands", []),
    );

    await user.click(
      screen.getAllByRole("link", { name: `Abrir ${planning.title}` })[0] ?? document.body,
    );

    await waitFor(() =>
      expect(router.state.location.pathname).toBe(`/admin/sesiones/${planning.id}`),
    );
  });

  test("Usuarios goes to the users page", async () => {
    const { user, router } = await openAdmin();

    server.use(
      getJson("/admin/users", []),
      getJson("/admin/enrollment-code", { code: "K7F2Q", url: "x" }),
    );

    await user.click(screen.getByRole("link", { name: "Usuarios" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/admin/usuarios"));
  });

  test("the teacher edits the profile from /admin too", async () => {
    server.use(
      http.patch(url("/me"), () => HttpResponse.json({ ...teacher, name: "Agus", avatar: "lion" })),
    );

    const { user } = await openAdmin();

    await user.click(screen.getByRole("button", { name: "Tu cuenta" }));
    await user.click(
      within(screen.getByRole("menu")).getByRole("button", { name: "Editar perfil" }),
    );

    const dialog = screen.getByRole("dialog", { name: "Tu perfil" });

    await user.clear(within(dialog).getByLabelText("Nombre"));
    await user.type(within(dialog).getByLabelText("Nombre"), "Agus");
    await user.click(within(dialog).getByRole("button", { name: "león" }));
    await user.click(within(dialog).getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("heading", { name: "Hola, Agus" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Tu cuenta" }).textContent).toBe("🦁");
  });
});
