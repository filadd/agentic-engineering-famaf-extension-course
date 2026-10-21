import { screen, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { Route as rootRoute } from "../src/routes/__root.tsx";
import { planning, sessionDetail } from "./fixtures/content.ts";
import { student } from "./fixtures/people.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { realClassroom, studentClassroom } from "./helpers/student-classroom.ts";
import { server } from "./helpers/server.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const crow = "🐦‍⬛";

describe("the brand", () => {
  test("the document is titled Kurasu and its icon is the crow", async () => {
    const { router } = await renderRoute("/login");

    await screen.findByRole("heading", { name: "Entrar al aula" });

    const root = router.state.matches.find((match) => match.routeId === rootRoute.id);
    const icon = root?.links?.find((link) => link?.rel === "icon");

    expect(root?.meta).toContainEqual({ title: "Kurasu" });
    expect(decodeURIComponent(icon?.href ?? "")).toContain(crow);
  });

  test("the login card shows the big crow instead of AV", async () => {
    await renderRoute("/login");

    await screen.findByRole("heading", { name: "Entrar al aula" });

    expect(screen.getByText(crow)).toBeTruthy();
    expect(screen.queryByText("AV")).toBeNull();
  });

  test("the student's crow in the header goes home", async () => {
    server.use(...studentClassroom({ session: sessionDetail(planning) }));

    const { router, user } = await renderRoute("/aula");

    await realClassroom(planning);
    await user.click(await screen.findByRole("link", { name: "Ir al inicio" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
    expect(await screen.findByRole("heading", { name: `Hola, ${student.name}` })).toBeTruthy();
  });

  test("the teacher's crow in a session's header goes to /admin", async () => {
    const page = teacherSession({ sessions: [{ ...sessionDetail(planning), enabled: true }] });

    server.use(...page.handlers);

    const { router, user } = await renderRoute(`/admin/sesiones/${planning.id}`);

    await user.click(await screen.findByRole("link", { name: "Ir al inicio" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/admin"));
  });
});
