import type { Me } from "@kurasu/contract/user";
import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import { newcomer, student, teacher } from "./fixtures/people.ts";
import { apiError, getJson, url } from "./helpers/api.ts";
import { recorder } from "./helpers/recorder.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { studentHome, teacherHome } from "./helpers/screens.ts";

const opensAs = (me: Me) => {
  const requests = recorder<unknown>();

  server.use(
    http.post(url("/auth/session"), async ({ request }) => {
      requests.record(await request.json());

      return HttpResponse.json(me);
    }),
  );

  return requests;
};

describe("/entrar", () => {
  test("a student with a complete profile goes to the home", async () => {
    opensAs(student);
    server.use(...studentHome(student));

    const { router } = await renderRoute("/entrar?codigo=abc123");

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
  });

  test("the teacher goes to the admin", async () => {
    opensAs(teacher);
    server.use(...teacherHome(teacher));

    const { router } = await renderRoute("/entrar?codigo=abc123");

    await waitFor(() => expect(router.state.location.pathname).toBe("/admin"));
  });

  test("a student who just registered goes to the setup", async () => {
    opensAs(newcomer);
    server.use(getJson("/me", newcomer));

    const { router } = await renderRoute("/entrar?codigo=abc123");

    await waitFor(() => expect(router.state.location.pathname).toBe("/setup"));
  });

  test("a used link shows the invalid-link notice with the way to the login", async () => {
    server.use(http.post(url("/auth/session"), () => apiError("InvalidLink")));

    await renderRoute("/entrar?codigo=abc123");

    expect(await screen.findByRole("heading", { name: "Este link ya no sirve" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Ir al login" }).getAttribute("href")).toBe("/login");
  });

  test("an account without access goes to the login", async () => {
    server.use(http.post(url("/auth/session"), () => apiError("NoAccess")));

    const { router } = await renderRoute("/entrar?codigo=abc123");

    await waitFor(() => expect(router.state.location.pathname).toBe("/login"));
  });

  test("mounted twice it sends a single POST, since the code is consumed once", async () => {
    const requests = opensAs(student);

    server.use(...studentHome(student));

    const { router } = await renderRoute("/entrar?codigo=abc123", { strict: true });

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(requests.calls).toEqual([{ code: "abc123" }]);
  });
});
