import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { ulid } from "./fixtures/ids.ts";
import { otherStudent, student, teacher, userOf } from "./fixtures/people.ts";
import { getJson } from "./helpers/api.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { userStore } from "./helpers/user-store.ts";

const pending = {
  id: ulid("S", 7),
  email: "joaquin@outlook.com",
  name: null,
  avatar: null,
  role: "student" as const,
};

const people = () => [
  userOf(teacher),
  userOf(student),
  userOf(otherStudent, false),
  userOf(pending),
];

const openUsers = async () => {
  const store = userStore(people());

  server.use(getJson("/me", teacher), ...store.handlers);

  const rendered = await renderRoute("/admin/usuarios");
  const list = await screen.findByRole("list", { name: "Usuarios" });

  await within(list).findAllByRole("listitem");

  return { ...rendered, store, list };
};

const namesIn = (list: HTMLElement) =>
  within(list)
    .queryAllByRole("listitem")
    .map((row) => row.getAttribute("aria-label"));

describe("/admin/usuarios", () => {
  test("searching filters by name or email without asking the API", async () => {
    const { user, list } = await openUsers();
    const search = screen.getByLabelText("Buscar por nombre o email");

    await user.type(search, "tomas");

    expect(namesIn(list)).toEqual(["Tomás"]);

    await user.clear(search);
    await user.type(search, "outlook");

    expect(namesIn(list)).toEqual([pending.email]);

    await user.clear(search);
    await user.type(search, "nadie");

    expect(namesIn(list)).toEqual([]);
    expect(screen.getByText("Nadie coincide con la búsqueda.")).toBeTruthy();
  });

  test("the filters show everyone, those with access and those without", async () => {
    const { user, list } = await openUsers();

    expect(namesIn(list)).toHaveLength(4);

    await user.click(screen.getByRole("tab", { name: "Con acceso (3)" }));

    expect(namesIn(list)).toEqual(["Agustín", "Lucía", pending.email]);

    await user.click(screen.getByRole("tab", { name: "Sin acceso (1)" }));

    expect(namesIn(list)).toEqual(["Tomás"]);

    await user.click(screen.getByRole("tab", { name: "Todos (4)" }));

    expect(namesIn(list)).toHaveLength(4);
  });

  test("adding an email shows it with access and without a name", async () => {
    const { user, list, store } = await openUsers();

    await user.click(screen.getByRole("button", { name: "Agregar por email" }));

    const dialog = screen.getByRole("dialog", { name: "Agregar por email" });

    await user.type(within(dialog).getByLabelText("Email"), "nueva@gmail.com");
    await user.click(within(dialog).getByRole("button", { name: "Agregar" }));

    const added = await within(list).findByRole("listitem", { name: "nueva@gmail.com" });

    expect(
      within(added).getByRole("switch", { name: "Con acceso" }).getAttribute("aria-checked"),
    ).toBe("true");
    expect(store.writes).toEqual([{ method: "POST", body: "nueva@gmail.com" }]);
  });

  test("a user added by email shows a dotted question mark, Sin nombre and the email below", async () => {
    const { list } = await openUsers();

    const row = within(list).getByRole("listitem", { name: pending.email });

    expect(row.textContent).toContain("?");
    expect(within(row).getByText("Sin nombre")).toBeTruthy();
    expect(within(row).getByText(pending.email).tagName).toBe("SMALL");
  });

  test("a user with a profile shows the name, the avatar and the email", async () => {
    const { list } = await openUsers();

    const row = within(list).getByRole("listitem", { name: student.name ?? "" });

    expect(within(row).getByText(student.name ?? "").tagName).toBe("B");
    expect(row.textContent).toContain("🦊");
    expect(within(row).getByText(student.email)).toBeTruthy();
    expect(within(row).queryByText("Sin nombre")).toBeNull();
  });

  test("adding a registered email shows that it is taken", async () => {
    const { user } = await openUsers();

    await user.click(screen.getByRole("button", { name: "Agregar por email" }));

    const dialog = screen.getByRole("dialog", { name: "Agregar por email" });

    await user.type(within(dialog).getByLabelText("Email"), student.email);
    await user.click(within(dialog).getByRole("button", { name: "Agregar" }));

    expect((await within(dialog).findByRole("alert")).textContent).toBe(
      "Ese email ya está registrado.",
    );
  });

  test("taking the access asks for confirmation, waits with Sacando… and leaves the row without access", async () => {
    const { user, list, store } = await openUsers();
    const row = within(list).getByRole("listitem", { name: "Lucía" });
    const held = heldResponse("patch", `/admin/users/${student.id}`);

    server.use(held.handler);
    await user.click(within(row).getByRole("switch", { name: "Con acceso" }));

    const confirm = screen.getByRole("alertdialog", { name: "¿Sacarle el acceso a Lucía?" });

    expect(store.writes).toEqual([]);

    await user.click(within(confirm).getByRole("button", { name: "Sacar acceso" }));

    expect(await within(confirm).findByRole("button", { name: "Sacando…" })).toBeTruthy();
    expect(
      within(row).getByRole("switch", { name: "Con acceso" }).getAttribute("aria-checked"),
    ).toBe("true");

    held.release();

    await waitFor(() =>
      expect(
        within(row).getByRole("switch", { name: "Sin acceso" }).getAttribute("aria-checked"),
      ).toBe("false"),
    );
    expect(store.writes).toEqual([{ method: "PATCH", body: { id: student.id, hasAccess: false } }]);
  });

  test("giving the access turns the switch on before the answer, without asking", async () => {
    const { user, list, store } = await openUsers();
    const row = within(list).getByRole("listitem", { name: "Tomás" });
    const held = heldResponse("patch", `/admin/users/${otherStudent.id}`);

    server.use(held.handler);
    await user.click(within(row).getByRole("switch", { name: "Sin acceso" }));

    expect(await within(row).findByRole("switch", { name: "Con acceso" })).toBeTruthy();
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(store.writes).toEqual([]);

    held.release();

    await waitFor(() => expect(store.writes).toHaveLength(1));
    expect(store.writes).toEqual([
      { method: "PATCH", body: { id: otherStudent.id, hasAccess: true } },
    ]);
  });

  test("regenerating the QR asks for confirmation and shows the new code and QR side by side", async () => {
    const { user, store } = await openUsers();

    await user.click(screen.getByRole("button", { name: "QR de registro" }));

    const view = screen.getByRole("dialog", { name: "QR de registro" });

    expect((await within(view).findByLabelText("Código del aula")).textContent).toBe("K7F2Q");
    expect(within(view).getByRole("img", { name: /registro\?codigo=K7F2Q$/ })).toBeTruthy();

    await user.click(within(view).getByRole("button", { name: "Regenerar código" }));

    const confirm = screen.getByRole("alertdialog", { name: "¿Regenerar el código de registro?" });

    expect(confirm.textContent).toContain("El código K7F2Q y su QR dejan de servir.");

    await user.click(within(confirm).getByRole("button", { name: "Regenerar" }));

    await waitFor(() =>
      expect(within(view).getByLabelText("Código del aula").textContent).toBe("Q9ZR3"),
    );
    expect(within(view).getByRole("img", { name: /registro\?codigo=Q9ZR3$/ })).toBeTruthy();
    expect(store.writes).toEqual([{ method: "POST", body: "enrollment-code" }]);
  });

  test("an empty email before the first add keeps the add button disabled and shows no field error", async () => {
    const { user } = await openUsers();

    await user.click(screen.getByRole("button", { name: "Agregar por email" }));

    const dialog = screen.getByRole("dialog", { name: "Agregar por email" });

    expect(within(dialog).getByRole("button", { name: "Agregar" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(within(dialog).queryByText("El email ingresado no es válido.")).toBeNull();
  });

  test("typing an invalid email shows no error while typing and the field error on add without asking the API", async () => {
    const { user, store } = await openUsers();

    await user.click(screen.getByRole("button", { name: "Agregar por email" }));

    const dialog = screen.getByRole("dialog", { name: "Agregar por email" });
    const input = within(dialog).getByLabelText("Email");
    const button = within(dialog).getByRole("button", { name: "Agregar" });

    await user.type(input, "ezequiel.pastore.@mi.unc.edu.ar");
    expect(within(dialog).queryByText("El email ingresado no es válido.")).toBeNull();

    await user.click(button);

    expect(await within(dialog).findByText("El email ingresado no es válido.")).toBeTruthy();
    expect(store.writes).toEqual([]);
  });

  test("after a failed add the field error revalidates on each keystroke and the add button disables on an empty email", async () => {
    const { user } = await openUsers();

    await user.click(screen.getByRole("button", { name: "Agregar por email" }));

    const dialog = screen.getByRole("dialog", { name: "Agregar por email" });
    const input = within(dialog).getByLabelText("Email");
    const button = within(dialog).getByRole("button", { name: "Agregar" });

    await user.type(input, "ezequiel.pastore.@mi.unc.edu.ar");
    await user.click(button);

    expect(await within(dialog).findByText("El email ingresado no es válido.")).toBeTruthy();

    await user.clear(input);

    expect(await within(dialog).findByText("El email ingresado no es válido.")).toBeTruthy();
    expect(button).toHaveProperty("disabled", true);

    await user.type(input, "nueva@gmail.com");

    await waitFor(() =>
      expect(within(dialog).queryByText("El email ingresado no es válido.")).toBeNull(),
    );
  });

  test("adding an email with spaces and capitals sends the normalized email", async () => {
    const { user, list, store } = await openUsers();

    await user.click(screen.getByRole("button", { name: "Agregar por email" }));

    const dialog = screen.getByRole("dialog", { name: "Agregar por email" });
    await user.type(within(dialog).getByLabelText("Email"), "  Nueva@Gmail.com  ");
    await user.click(within(dialog).getByRole("button", { name: "Agregar" }));

    expect(await within(list).findByRole("listitem", { name: "nueva@gmail.com" })).toBeTruthy();
    expect(store.writes).toEqual([{ method: "POST", body: "nueva@gmail.com" }]);
  });
});
