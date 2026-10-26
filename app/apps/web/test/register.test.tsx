import { screen, waitFor } from "@testing-library/react";
import { http } from "msw";
import { describe, expect, test } from "vitest";

import { apiError, noContent, url } from "./helpers/api.ts";
import { isBefore } from "./helpers/is-before.ts";
import { recordPosts } from "./helpers/record-posts.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";

const sendEmail = async (user: Awaited<ReturnType<typeof renderRoute>>["user"], email: string) => {
  await user.type(await screen.findByLabelText("Tu email"), email);
  await user.click(screen.getByRole("button", { name: "Mandame el link" }));
};

describe("/registro", () => {
  test("opening the QR starts at the email step with the code in place", async () => {
    const requests = recordPosts("/auth/link");

    const { user } = await renderRoute("/registro?codigo=K7F2Q");

    expect(screen.queryByLabelText("Código del aula")).toBeNull();

    await sendEmail(user, "nueva@gmail.com");

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
    expect(requests.calls).toEqual([{ email: "nueva@gmail.com", enrollmentCode: "K7F2Q" }]);
  });

  test("typing the code by hand goes through the code step, the email step and the check-your-mail view", async () => {
    const requests = recordPosts("/auth/link");

    const { user } = await renderRoute("/registro");

    const next = await screen.findByRole("button", { name: "Seguir" });

    expect(next).toHaveProperty("disabled", true);

    await user.type(screen.getByLabelText("Código del aula"), "k7f2q");
    await user.click(next);
    await sendEmail(user, "nueva@gmail.com");

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
    expect(requests.calls).toEqual([{ email: "nueva@gmail.com", enrollmentCode: "K7F2Q" }]);
  });

  test("an account without access sees the no-access notice", async () => {
    server.use(http.post(url("/auth/link"), () => apiError("NoAccess")));

    const { user } = await renderRoute("/registro?codigo=K7F2Q");

    await sendEmail(user, "tomas@gmail.com");

    const alert = await screen.findByRole("alert");
    const button = screen.getByRole("button", { name: "Mandame el link" });

    expect(alert.textContent).toContain("Tu cuenta todavía no tiene acceso al aula");
    expect(isBefore(alert, button)).toBe(true);
  });

  test("a mail that does not go out shows an error in the form and lets the person ask again", async () => {
    let attempts = 0;

    server.use(
      http.post(url("/auth/link"), () => {
        attempts += 1;

        return attempts === 1 ? apiError("MailNotSent") : noContent();
      }),
    );

    const { user } = await renderRoute("/registro?codigo=K7F2Q");

    await sendEmail(user, "nueva@gmail.com");

    const alert = await screen.findByRole("alert");
    const button = screen.getByRole("button", { name: "Mandame el link" });

    expect(alert.textContent).toContain("No pudimos mandarte el mail");
    expect(isBefore(alert, button)).toBe(true);

    await user.click(button);

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
  });

  test("an empty email before the first send keeps the button disabled and shows no field error", async () => {
    await renderRoute("/registro?codigo=K7F2Q");

    expect(await screen.findByRole("button", { name: "Mandame el link" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(screen.queryByText("El email ingresado no es válido.")).toBeNull();
  });

  test("typing an invalid email shows no error while typing and the field error on send without asking the API", async () => {
    const requests = recordPosts("/auth/link");

    const { user } = await renderRoute("/registro?codigo=K7F2Q");
    const input = await screen.findByLabelText("Tu email");

    await user.type(input, "ezequiel.pastore.@mi.unc.edu.ar");
    expect(screen.queryByText("El email ingresado no es válido.")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Mandame el link" }));

    expect(await screen.findByText("El email ingresado no es válido.")).toBeTruthy();
    expect(requests.calls).toEqual([]);
  });

  test("after a failed send the field error revalidates on each keystroke and the button disables on an empty email", async () => {
    const { user } = await renderRoute("/registro?codigo=K7F2Q");

    const input = await screen.findByLabelText("Tu email");
    const button = screen.getByRole("button", { name: "Mandame el link" });

    await user.type(input, "ezequiel.pastore.@mi.unc.edu.ar");
    await user.click(button);

    expect(await screen.findByText("El email ingresado no es válido.")).toBeTruthy();

    await user.clear(input);

    expect(await screen.findByText("El email ingresado no es válido.")).toBeTruthy();
    expect(button).toHaveProperty("disabled", true);

    await user.type(input, "nueva@gmail.com");

    await waitFor(() => expect(screen.queryByText("El email ingresado no es válido.")).toBeNull());
  });

  test("sending an email with spaces and capitals asks for the link with the normalized email", async () => {
    const requests = recordPosts("/auth/link");

    const { user } = await renderRoute("/registro?codigo=K7F2Q");

    const input = await screen.findByLabelText("Tu email");
    await user.type(input, "  Nueva@Gmail.com  ");
    await user.click(screen.getByRole("button", { name: "Mandame el link" }));

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
    expect(requests.calls).toEqual([{ email: "nueva@gmail.com", enrollmentCode: "K7F2Q" }]);
  });
});
