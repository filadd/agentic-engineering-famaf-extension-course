import { screen } from "@testing-library/react";
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

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Tu cuenta todavía no tiene acceso al aula",
    );
  });

  test("an email that is not registered sees that it is not registered", async () => {
    server.use(http.post(url("/auth/link"), () => apiError("NotRegistered")));

    await requestLinkWith("nadie@mail.com");

    expect((await screen.findByRole("alert")).textContent).toContain(
      "Ese email no está registrado",
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

    const user = await requestLinkWith("lucia@mail.com");

    expect((await screen.findByRole("alert")).textContent).toContain("No pudimos mandarte el mail");

    await user.click(screen.getByRole("button", { name: "Mandame el link" }));

    expect(await screen.findByRole("heading", { name: "Revisá tu mail" })).toBeTruthy();
  });
});
