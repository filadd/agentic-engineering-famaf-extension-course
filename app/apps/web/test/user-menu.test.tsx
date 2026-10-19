import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import { student } from "./fixtures/people.ts";
import { noContent, url } from "./helpers/api.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { recorder } from "./helpers/recorder.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { studentHome } from "./helpers/screens.ts";
import { server } from "./helpers/server.ts";

const openMenu = async (user: Awaited<ReturnType<typeof renderRoute>>["user"]) => {
  await user.click(await screen.findByRole("button", { name: "Tu cuenta" }));

  return screen.getByRole("menu");
};

describe("user menu", () => {
  test("the student edits the profile and the header shows the new name and avatar without reloading", async () => {
    const updates = recorder<unknown>();

    server.use(
      ...studentHome(student),
      http.patch(url("/me"), async ({ request }) => {
        updates.record(await request.json());

        return HttpResponse.json({ ...student, name: "Lu", avatar: "panda" });
      }),
    );

    const { user } = await renderRoute("/");

    expect(await screen.findByRole("heading", { name: "Hola, Lucía" })).toBeTruthy();

    await user.click(within(await openMenu(user)).getByRole("button", { name: "Editar perfil" }));

    const dialog = screen.getByRole("dialog", { name: "Tu perfil" });
    const name = within(dialog).getByLabelText("Nombre");

    await user.clear(name);
    await user.type(name, "Lu");
    await user.click(within(dialog).getByRole("button", { name: "panda" }));
    await user.click(within(dialog).getByRole("button", { name: "Guardar" }));

    expect(await screen.findByRole("heading", { name: "Hola, Lu" })).toBeTruthy();
    expect(screen.queryByRole("dialog", { name: "Tu perfil" })).toBeNull();
    expect(screen.getByRole("button", { name: "Tu cuenta" }).textContent).toBe("🐼");
    expect(updates.calls).toEqual([{ name: "Lu", avatar: "panda" }]);
  });

  test("Escape closes the menu", async () => {
    server.use(...studentHome(student));

    const { user } = await renderRoute("/");

    await openMenu(user);
    await user.keyboard("{Escape}");

    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("a click outside closes the menu", async () => {
    server.use(...studentHome(student));

    const { user } = await renderRoute("/");

    const menu = await openMenu(user);

    await user.click(menu.previousElementSibling ?? document.body);

    expect(screen.queryByRole("menu")).toBeNull();
  });

  test("a failed profile save keeps the form with what was typed and shows the error", async () => {
    server.use(...studentHome(student), failingRoute("patch", "/me"));

    const { user } = await renderRoute("/");

    await user.click(within(await openMenu(user)).getByRole("button", { name: "Editar perfil" }));

    const dialog = screen.getByRole("dialog", { name: "Tu perfil" });
    const name = within(dialog).getByLabelText("Nombre");

    await user.clear(name);
    await user.type(name, "Lu");
    await user.click(within(dialog).getByRole("button", { name: "panda" }));
    await user.click(within(dialog).getByRole("button", { name: "Guardar" }));

    expect((await within(dialog).findByRole("alert")).textContent).toBe(
      "No se pudo guardar tu perfil. Probá de nuevo.",
    );
    expect(within(dialog).getByLabelText("Nombre")).toHaveProperty("value", "Lu");
    expect(within(dialog).getByRole("button", { name: "panda" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(screen.getByRole("heading", { name: "Hola, Lucía" })).toBeTruthy();
  });

  test("turning on the dark mode marks the page dark and keeps it", async () => {
    server.use(...studentHome(student));

    const { user } = await renderRoute("/");

    await user.click(within(await openMenu(user)).getByRole("switch", { name: "Modo oscuro" }));

    expect(document.documentElement.classList.contains("dark")).toBe(true);
    expect(JSON.parse(localStorage.getItem("kurasu:theme") ?? "null")).toBe("dark");
  });

  test("coming back with the dark mode saved starts dark", async () => {
    localStorage.setItem("kurasu:theme", JSON.stringify("dark"));
    server.use(...studentHome(student));

    await renderRoute("/");

    await waitFor(() => expect(document.documentElement.classList.contains("dark")).toBe(true));
  });

  test("an invalid saved theme starts light", async () => {
    localStorage.setItem("kurasu:theme", "purple");
    server.use(...studentHome(student));

    const { user } = await renderRoute("/");

    const toggle = within(await openMenu(user)).getByRole("switch", { name: "Modo oscuro" });

    expect(toggle.getAttribute("aria-checked")).toBe("false");
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  test("logging out posts the logout and goes to the login", async () => {
    const logouts = recorder<string>();

    server.use(
      ...studentHome(student),
      http.post(url("/auth/logout"), ({ request }) => {
        logouts.record(request.method);

        return noContent();
      }),
    );

    const { router, user } = await renderRoute("/");

    await user.click(within(await openMenu(user)).getByRole("button", { name: "Cerrar sesión" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/login"));
    expect(logouts.calls).toEqual(["POST"]);
  });

  test("a failed logout shows a toast and stays on the page", async () => {
    server.use(...studentHome(student), failingRoute("post", "/auth/logout"));

    const { router, user } = await renderRoute("/");

    await user.click(within(await openMenu(user)).getByRole("button", { name: "Cerrar sesión" }));

    expect(await screen.findByText("No se pudo cerrar la sesión.")).toBeTruthy();
    expect(router.state.location.pathname).toBe("/");
    expect(screen.getByRole("heading", { name: "Hola, Lucía" })).toBeTruthy();
  });
});
