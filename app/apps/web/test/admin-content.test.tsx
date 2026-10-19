import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { planning, sessionDetail, vibeCoding } from "./fixtures/content.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const openContent = async (enabled: boolean) => {
  const page = teacherSession({
    sessions: [
      { ...sessionDetail(vibeCoding), enabled: true },
      { ...sessionDetail(planning), enabled },
    ],
  });

  server.use(...page.handlers);

  const rendered = await renderRoute(`/admin/sesiones/${planning.id}`);
  const card = await screen.findByRole("region", { name: "La sesión" });

  await within(card).findByRole("switch");

  return { ...rendered, card, store: page.store };
};

describe("session page: content", () => {
  test("editing the title and the summary patches them and the header shows the new title", async () => {
    const { user, card, store } = await openContent(false);

    expect(await within(card).findByText("Sesión 2 de 2")).toBeTruthy();

    const title = within(card).getByLabelText("Título");

    await user.clear(title);
    await user.type(title, "Planificar con agentes");
    await user.click(within(card).getByRole("button", { name: "Guardar" }));

    expect(
      await screen.findByRole("heading", { level: 1, name: "Planificar con agentes" }),
    ).toBeTruthy();
    expect(store.writes).toEqual([
      { method: "PATCH", body: { title: "Planificar con agentes", summary: planning.summary } },
    ]);
  });

  test("enabling turns the switch on and patches enabled", async () => {
    const { user, card, store } = await openContent(false);

    await user.click(within(card).getByRole("switch", { name: "Deshabilitada" }));

    await waitFor(() =>
      expect(
        within(card).getByRole("switch", { name: "Habilitada" }).getAttribute("aria-checked"),
      ).toBe("true"),
    );
    expect(store.writes).toEqual([{ method: "PATCH", body: { enabled: true } }]);
  });

  test("disabling turns the switch off and offers to delete", async () => {
    const { user, card } = await openContent(true);

    expect(within(card).queryByRole("button", { name: "Borrar sesión" })).toBeNull();

    await user.click(within(card).getByRole("switch", { name: "Habilitada" }));

    expect(await within(card).findByRole("button", { name: "Borrar sesión" })).toBeTruthy();
    expect(
      within(card).getByRole("switch", { name: "Deshabilitada" }).getAttribute("aria-checked"),
    ).toBe("false");
  });

  test("deleting and confirming deletes the session and goes back to /admin", async () => {
    const { user, card, store, router } = await openContent(false);

    await user.click(within(card).getByRole("button", { name: "Borrar sesión" }));
    await user.click(
      within(screen.getByRole("alertdialog", { name: `¿Borrar "${planning.title}"?` })).getByRole(
        "button",
        {
          name: "Borrar",
        },
      ),
    );

    await waitFor(() => expect(router.state.location.pathname).toBe("/admin"));
    expect(store.writes).toEqual([{ method: "DELETE", body: planning.id }]);
  });

  test("deleting and cancelling does nothing", async () => {
    const { user, card, store, router } = await openContent(false);

    await user.click(within(card).getByRole("button", { name: "Borrar sesión" }));
    await user.click(
      within(screen.getByRole("alertdialog")).getByRole("button", { name: "Cancelar" }),
    );

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(store.writes).toEqual([]);
    expect(router.state.location.pathname).toBe(`/admin/sesiones/${planning.id}`);
  });

  test("Escape on the delete confirmation cancels it and does nothing", async () => {
    const { user, card, store, router } = await openContent(false);

    await user.click(within(card).getByRole("button", { name: "Borrar sesión" }));
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(store.writes).toEqual([]);
    expect(router.state.location.pathname).toBe(`/admin/sesiones/${planning.id}`);
  });

  test("an enabled session has no delete button", async () => {
    const { card } = await openContent(true);

    expect(within(card).queryByRole("button", { name: "Borrar sesión" })).toBeNull();
  });
});
