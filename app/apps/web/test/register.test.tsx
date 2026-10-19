import { screen } from "@testing-library/react";
import { http } from "msw";
import { describe, expect, test } from "vitest";

import { apiError, noContent, url } from "./helpers/api.ts";
import { recorder } from "./helpers/recorder.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";

const sendEmail = async (user: Awaited<ReturnType<typeof renderRoute>>["user"], email: string) => {
  await user.type(await screen.findByLabelText("Tu email"), email);
  await user.click(screen.getByRole("button", { name: "Mandame el link" }));
};

describe("/registro", () => {
  test("opening the QR starts at the email step with the code in place", async () => {
    const requests = recorder<unknown>();

    server.use(
      http.post(url("/auth/link"), async ({ request }) => {
        requests.record(await request.json());

        return noContent();
      }),
    );

    const { user } = await renderRoute("/registro?codigo=K7F2Q");

    expect(screen.queryByLabelText("Código del aula")).toBeNull();

    await sendEmail(user, "nueva@gmail.com");

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
    expect(requests.calls).toEqual([{ email: "nueva@gmail.com", enrollmentCode: "K7F2Q" }]);
  });

  test("typing the code by hand goes through the code step, the email step and the check-your-mail view", async () => {
    const requests = recorder<unknown>();

    server.use(
      http.post(url("/auth/link"), async ({ request }) => {
        requests.record(await request.json());

        return noContent();
      }),
    );

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

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Tu cuenta todavía no tiene acceso al aula",
    );
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

    expect((await screen.findByRole("alert")).textContent).toContain("No pudimos mandarte el mail");

    await user.click(screen.getByRole("button", { name: "Mandame el link" }));

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
  });
});
