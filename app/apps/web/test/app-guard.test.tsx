import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import { newcomer, student, teacher } from "./fixtures/people.ts";
import { apiError, getJson, url } from "./helpers/api.ts";
import { recorder } from "./helpers/recorder.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { studentHome, teacherHome } from "./helpers/screens.ts";
import { server } from "./helpers/server.ts";

describe("_app and /setup", () => {
  test("without a login the home sends to the login", async () => {
    server.use(http.get(url("/me"), () => apiError("Unauthenticated")));

    const { router } = await renderRoute("/");

    await waitFor(() => expect(router.state.location.pathname).toBe("/login"));
  });

  test("without access the classroom sends to the login", async () => {
    server.use(http.get(url("/me"), () => apiError("NoAccess")));

    const { router } = await renderRoute("/aula");

    await waitFor(() => expect(router.state.location.pathname).toBe("/login"));
  });

  test("an incomplete profile sends to the setup", async () => {
    server.use(getJson("/me", newcomer));

    const { router } = await renderRoute("/");

    await waitFor(() => expect(router.state.location.pathname).toBe("/setup"));
  });

  test("completing the setup saves the animal key and the name, then goes home", async () => {
    const updates = recorder<unknown>();
    const done = { ...newcomer, name: "Lucía", avatar: "fox" as const };

    server.use(
      getJson("/me", newcomer),
      http.patch(url("/me"), async ({ request }) => {
        updates.record(await request.json());

        return HttpResponse.json(done);
      }),
      ...studentHome(done).slice(1),
    );

    const { router, user } = await renderRoute("/setup");

    const save = await screen.findByRole("button", { name: "Entrar al aula" });

    expect(save).toHaveProperty("disabled", true);

    await user.type(screen.getByLabelText("Buscar un animal"), "zorro");

    expect(screen.queryByRole("button", { name: "panda" })).toBeNull();

    await user.click(screen.getByRole("button", { name: "zorro" }));

    expect(save).toHaveProperty("disabled", true);

    await user.type(screen.getByLabelText("Tu nombre"), "Lucía");
    await user.click(save);

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(updates.calls).toEqual([{ name: "Lucía", avatar: "fox" }]);
  });

  test("a student asking for /admin goes home", async () => {
    server.use(...studentHome(student));

    const { router } = await renderRoute("/admin");

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
  });

  test("the teacher asking for / goes to /admin", async () => {
    server.use(...teacherHome(teacher));

    const { router } = await renderRoute("/");

    await waitFor(() => expect(router.state.location.pathname).toBe("/admin"));
  });

  test("losing access with the app open sends to the login on the next request", async () => {
    server.use(
      getJson("/me", student),
      http.get(url("/sessions"), () => apiError("NoAccess")),
      getJson("/polls", []),
    );

    const { router } = await renderRoute("/");

    await waitFor(() => expect(router.state.location.pathname).toBe("/login"));
  });
});
