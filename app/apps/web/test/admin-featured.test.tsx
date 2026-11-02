import type { RaisedHand } from "@kurasu/contract/raised-hands";
import type { Session } from "@kurasu/contract/sessions";
import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import {
  adminPoll,
  choicePoll,
  planning,
  sessionDetail,
  tooling,
  vibeCoding,
} from "./fixtures/content.ts";
import { student } from "./fixtures/people.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const hand: RaisedHand = {
  sessionId: tooling.id,
  user: { id: student.id, name: student.name, avatar: student.avatar },
};

const detail = (summary: typeof planning, fields: Partial<Session> = {}): Session => ({
  ...sessionDetail(summary),
  enabled: true,
  ...fields,
});

interface Options {
  planningFields?: Partial<Session>;
  otherIsFeatured?: boolean;
  isOtherFeaturedQuestions?: boolean;
}

const open = async ({
  planningFields = {},
  otherIsFeatured = false,
  isOtherFeaturedQuestions = false,
}: Options = {}) => {
  const page = teacherSession({
    sessions: [
      detail(vibeCoding),
      detail(planning, planningFields),
      detail(tooling, { featured: otherIsFeatured, featuredQuestions: isOtherFeaturedQuestions }),
    ],
    polls: [adminPoll(choicePoll(tooling.id), "active", { count: 0, choice: [0, 0, 0, 0] })],
    hands: [hand],
  });

  server.use(...page.handlers);

  const rendered = await renderRoute(`/admin/sesiones/${planning.id}`);
  const card = await screen.findByRole("region", { name: "La sesión" });

  await within(card).findByRole("switch", { name: /abilitada/ });

  return { ...rendered, card, store: page.store };
};

const patchPath = `/admin/sessions/${planning.id}`;

describe("session page: enabling and featuring", () => {
  test("enabling opens a dialog with Destacada on and no warning, and Habilitar sends enabled and featured", async () => {
    const { user, card, store } = await open({ planningFields: { enabled: false } });

    await user.click(within(card).getByRole("switch", { name: "Deshabilitada" }));

    const dialog = screen.getByRole("dialog", { name: `Habilitar "${planning.title}"` });

    expect(
      within(dialog).getByRole("switch", { name: "Destacada" }).getAttribute("aria-checked"),
    ).toBe("true");
    expect(within(dialog).queryByText(/deja de serlo/)).toBeNull();

    await user.click(within(dialog).getByRole("button", { name: "Habilitar" }));

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { enabled: true, featured: true } }]),
    );
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  });

  test("enabling while another session is featured names it and counts what it loses", async () => {
    const { user, card } = await open({
      planningFields: { enabled: false },
      otherIsFeatured: true,
    });

    await user.click(within(card).getByRole("switch", { name: "Deshabilitada" }));

    const dialog = screen.getByRole("dialog", { name: `Habilitar "${planning.title}"` });

    expect(
      await within(dialog).findByText(`Hoy la destacada es "${tooling.title}" y deja de serlo:`),
    ).toBeTruthy();
    expect(await within(dialog).findByText(/Se cierra 1 encuesta activa/)).toBeTruthy();
    expect(within(dialog).getByText("Se baja 1 mano levantada.")).toBeTruthy();
  });

  test("turning Destacada off in the dialog removes the warning and sends only enabled", async () => {
    const { user, card, store } = await open({
      planningFields: { enabled: false },
      otherIsFeatured: true,
    });

    await user.click(within(card).getByRole("switch", { name: "Deshabilitada" }));

    const dialog = screen.getByRole("dialog", { name: `Habilitar "${planning.title}"` });

    await user.click(within(dialog).getByRole("switch", { name: "Destacada" }));

    expect(within(dialog).queryByText(/deja de serlo/)).toBeNull();

    await user.click(within(dialog).getByRole("button", { name: "Habilitar" }));

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { enabled: true } }]),
    );
  });

  test("while enabling waits, the dialog says Habilitando…, cannot be cancelled and ignores Escape and outside clicks", async () => {
    const { user, card } = await open({ planningFields: { enabled: false } });
    const held = heldResponse("patch", patchPath);

    server.use(held.handler);
    await user.click(within(card).getByRole("switch", { name: "Deshabilitada" }));

    const dialog = screen.getByRole("dialog", { name: `Habilitar "${planning.title}"` });

    await user.click(within(dialog).getByRole("button", { name: "Habilitar" }));

    expect(await within(dialog).findByRole("button", { name: "Habilitando…" })).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "Cancelar" })).toHaveProperty(
      "disabled",
      true,
    );

    await user.keyboard("{Escape}");

    expect(screen.getByRole("dialog", { name: `Habilitar "${planning.title}"` })).toBeTruthy();

    held.release();
  });

  test("a failed enable shows the error inside the dialog, which stays open", async () => {
    const { user, card } = await open({ planningFields: { enabled: false } });

    server.use(failingRoute("patch", patchPath));
    await user.click(within(card).getByRole("switch", { name: "Deshabilitada" }));

    const dialog = screen.getByRole("dialog", { name: `Habilitar "${planning.title}"` });

    await user.click(within(dialog).getByRole("button", { name: "Habilitar" }));

    expect(
      await within(dialog).findByText("No se pudo guardar el cambio. Probá de nuevo."),
    ).toBeTruthy();
    expect(screen.getByRole("dialog", { name: `Habilitar "${planning.title}"` })).toBeTruthy();
  });

  test("disabling a session that is not the featured one turns the switch off before the answer, with no dialog", async () => {
    const { user, card, store } = await open({ otherIsFeatured: true });
    const held = heldResponse("patch", patchPath);

    server.use(held.handler);
    await user.click(within(card).getByRole("switch", { name: "Habilitada" }));

    expect(
      (await within(card).findByRole("switch", { name: "Deshabilitada" })).getAttribute(
        "aria-checked",
      ),
    ).toBe("false");
    expect(screen.queryByRole("alertdialog")).toBeNull();

    held.release();

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { enabled: false } }]),
    );
  });

  test("disabling the featured session asks first, with what it loses, and then sends enabled false", async () => {
    const { user, card, store } = await open({ planningFields: { featured: true } });

    await user.click(within(card).getByRole("switch", { name: "Habilitada" }));

    const confirm = screen.getByRole("alertdialog", { name: `¿Deshabilitar "${planning.title}"?` });

    expect(await within(confirm).findByText(/Se cierra 1 encuesta activa/)).toBeTruthy();
    expect(store.writes).toEqual([]);

    await user.click(within(confirm).getByRole("button", { name: "Deshabilitar" }));

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { enabled: false } }]),
    );
  });

  test("featuring with no other featured session sends at once with no dialog, and the switch waits for the answer", async () => {
    const { user, card, store } = await open();
    const held = heldResponse("patch", patchPath);

    server.use(held.handler);
    await user.click(within(card).getByRole("switch", { name: "Destacada" }));

    expect(screen.queryByRole("alertdialog")).toBeNull();
    await waitFor(() =>
      expect(within(card).getByRole("switch", { name: "Destacada" })).toHaveProperty(
        "disabled",
        true,
      ),
    );
    expect(
      within(card).getByRole("switch", { name: "Destacada" }).getAttribute("aria-checked"),
    ).toBe("false");

    held.release();

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { featured: true } }]),
    );
  });

  test("featuring while another session is featured asks first, naming it and what it loses", async () => {
    const { user, card, store } = await open({ otherIsFeatured: true });

    await user.click(within(card).getByRole("switch", { name: "Destacada" }));

    const confirm = screen.getByRole("alertdialog", { name: `¿Destacar "${planning.title}"?` });

    expect(within(confirm).getByText(`"${tooling.title}" deja de ser la destacada:`)).toBeTruthy();
    expect(await within(confirm).findByText(/Se cierra 1 encuesta activa/)).toBeTruthy();
    expect(within(confirm).getByText("Se baja 1 mano levantada.")).toBeTruthy();

    await user.click(within(confirm).getByRole("button", { name: "Destacar" }));

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { featured: true } }]),
    );
  });

  test("removing the mark asks first and says that the featured questions turn off when they were on", async () => {
    const { user, card, store } = await open({
      planningFields: { featured: true, featuredQuestions: true },
    });

    await user.click(within(card).getByRole("switch", { name: "Destacada" }));

    const confirm = screen.getByRole("alertdialog", {
      name: `¿Sacarle la marca de destacada a "${planning.title}"?`,
    });

    expect(
      await within(confirm).findByText("Se apaga el modo de preguntas destacadas."),
    ).toBeTruthy();

    await user.click(within(confirm).getByRole("button", { name: "Sacar la marca" }));

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { featured: false } }]),
    );
  });

  test("a failed confirmation shows the error inside the dialog and no toast", async () => {
    const { user, card } = await open({ otherIsFeatured: true });

    server.use(failingRoute("patch", patchPath));
    await user.click(within(card).getByRole("switch", { name: "Destacada" }));

    const confirm = screen.getByRole("alertdialog", { name: `¿Destacar "${planning.title}"?` });

    await user.click(within(confirm).getByRole("button", { name: "Destacar" }));

    expect(await within(confirm).findByRole("alert")).toBeTruthy();
    expect(within(confirm).getByText("No se pudo guardar el cambio. Probá de nuevo.")).toBeTruthy();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  test("a failed featuring with no other featured session shows a toast and the switch goes back off", async () => {
    const { user, card } = await open();

    server.use(failingRoute("patch", patchPath));
    await user.click(within(card).getByRole("switch", { name: "Destacada" }));

    expect(await screen.findByText("No se pudo destacar la sesión.")).toBeTruthy();
    await waitFor(() =>
      expect(
        within(card).getByRole("switch", { name: "Destacada" }).getAttribute("aria-checked"),
      ).toBe("false"),
    );
  });

  test("a failed disable of the featured session shows the error inside the dialog and no toast", async () => {
    const { user, card } = await open({ planningFields: { featured: true } });

    server.use(failingRoute("patch", patchPath));
    await user.click(within(card).getByRole("switch", { name: "Habilitada" }));

    const confirm = screen.getByRole("alertdialog", { name: `¿Deshabilitar "${planning.title}"?` });

    await user.click(within(confirm).getByRole("button", { name: "Deshabilitar" }));

    expect(
      await within(confirm).findByText("No se pudo guardar el cambio. Probá de nuevo."),
    ).toBeTruthy();
    expect(screen.queryByText("No se pudo deshabilitar la sesión.")).toBeNull();
    expect(screen.getAllByRole("alert")).toHaveLength(1);
  });

  test("a disabled session cannot be featured and says to enable it first", async () => {
    const { card } = await open({ planningFields: { enabled: false } });

    expect(within(card).getByRole("switch", { name: "Destacada" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(within(card).getByText("Habilitá la sesión para poder destacarla.")).toBeTruthy();
  });

  test("the card has no Sesión N de M", async () => {
    const { card } = await open();

    expect(within(card).queryByText(/Sesión \d+ de \d+/)).toBeNull();
  });
});
