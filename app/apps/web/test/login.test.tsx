import { screen, waitFor } from "@testing-library/react";
import { http } from "msw";
import { describe, expect, test } from "vitest";

import { apiError, noContent, url } from "./helpers/api.ts";
import { recorder } from "./helpers/recorder.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";

const requestLinkWith = async (email: string) => {
  const { user } = await renderRoute("/login");

  await user.type(await screen.findByLabelText("Tu email"), email);
  await user.click(screen.getByRole("button", { name: "Mandame el link" }));

  return user;
};

describe("/login", () => {
  test("requesting the link shows the check-your-mail view with the email", async () => {
    const requests = recorder<unknown>();

    server.use(
      http.post(url("/auth/link"), async ({ request }) => {
        requests.record(await request.json());

        return noContent();
      }),
    );

    await requestLinkWith("lucia@mail.com");

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
    expect(screen.getByText("lucia@mail.com")).toBeTruthy();
    expect(requests.calls).toEqual([{ email: "lucia@mail.com" }]);
  });

  test("an account without access sees that the teacher has to give it access", async () => {
    server.use(http.post(url("/auth/link"), () => apiError("NoAccess")));

    await requestLinkWith("tomas@mail.com");

    const alert = await screen.findByRole("alert");
    const button = screen.getByRole("button", { name: "Mandame el link" });

    expect(alert.textContent).toContain("Tu cuenta todavía no tiene acceso al aula");
    expect(alert.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test("an email that is not registered sees that it is not registered", async () => {
    server.use(http.post(url("/auth/link"), () => apiError("NotRegistered")));

    await requestLinkWith("nadie@mail.com");

    const alert = await screen.findByRole("alert");
    const button = screen.getByRole("button", { name: "Mandame el link" });

    expect(alert.textContent).toContain("Ese email no está registrado");
    expect(alert.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  test("a mail that does not go out shows an error in the form and lets the person ask again", async () => {
    let attempts = 0;

    server.use(
      http.post(url("/auth/link"), () => {
        attempts += 1;

        return attempts === 1 ? apiError("MailNotSent") : noContent();
      }),
    );

    const user = await requestLinkWith("lucia@mail.com");

    const alert = await screen.findByRole("alert");
    const button = screen.getByRole("button", { name: "Mandame el link" });

    expect(alert.textContent).toContain("No pudimos mandarte el mail");
    expect(alert.compareDocumentPosition(button) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await user.click(button);

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
  });

  test("an empty email before the first send keeps the button disabled and shows no field error", async () => {
    await renderRoute("/login");

    expect(await screen.findByRole("button", { name: "Mandame el link" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(screen.queryByText("El email ingresado no es válido.")).toBeNull();
  });

  test("typing an invalid email shows no error while typing and the field error on send without asking the API", async () => {
    const requests = recorder<unknown>();

    server.use(
      http.post(url("/auth/link"), async ({ request }) => {
        requests.record(await request.json());

        return noContent();
      }),
    );

    const { user } = await renderRoute("/login");
    const input = await screen.findByLabelText("Tu email");

    await user.type(input, "ezequiel.pastore.@mi.unc.edu.ar");
    expect(screen.queryByText("El email ingresado no es válido.")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Mandame el link" }));

    expect(await screen.findByText("El email ingresado no es válido.")).toBeTruthy();
    expect(requests.calls).toEqual([]);
  });

  test("after a failed send the field error revalidates on each keystroke and the button disables on an empty email", async () => {
    const { user } = await renderRoute("/login");

    const input = await screen.findByLabelText("Tu email");
    const button = screen.getByRole("button", { name: "Mandame el link" });

    await user.type(input, "ezequiel.pastore.@mi.unc.edu.ar");
    await user.click(button);

    expect(await screen.findByText("El email ingresado no es válido.")).toBeTruthy();

    await user.clear(input);

    expect(await screen.findByText("El email ingresado no es válido.")).toBeTruthy();
    expect(button).toHaveProperty("disabled", true);

    await user.type(input, "lucia@mail.com");

    await waitFor(() => expect(screen.queryByText("El email ingresado no es válido.")).toBeNull());
  });

  test("sending an email with spaces and capitals asks for the link with the normalized email", async () => {
    const requests = recorder<unknown>();

    server.use(
      http.post(url("/auth/link"), async ({ request }) => {
        requests.record(await request.json());

        return noContent();
      }),
    );

    const { user } = await renderRoute("/login");

    const input = await screen.findByLabelText("Tu email");
    await user.type(input, "  Lucia@Mail.com  ");
    await user.click(screen.getByRole("button", { name: "Mandame el link" }));

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
    expect(requests.calls).toEqual([{ email: "lucia@mail.com" }]);
  });
});
