import { screen, within } from "@testing-library/react";
import { afterEach, describe, expect, test } from "vitest";

import { choicePoll, planning, sessionDetail } from "./fixtures/content.ts";
import { student, teacher } from "./fixtures/people.ts";
import { classroomSocket } from "./helpers/classroom-socket.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { studentClassroom } from "./helpers/student-classroom.ts";
import { desktopViewport, phoneViewport } from "./helpers/viewport.ts";

const storedUi = () => JSON.parse(localStorage.getItem("kurasu:classroom") ?? "null");

const enter = async (options: Partial<Parameters<typeof studentClassroom>[0]> = {}) => {
  server.use(
    ...studentClassroom({ session: sessionDetail(planning), slides: null, ...options }),
    classroomSocket({ people: [teacher, student] }).handler,
  );

  const rendered = await renderRoute("/aula");

  await screen.findByRole("complementary", { name: "Panel del aula" });

  return rendered;
};

afterEach(() => {
  desktopViewport();
});

describe("/aula panel", () => {
  test("hiding the panel leaves a strip and saves it", async () => {
    const { user } = await enter();

    await user.click(screen.getByRole("button", { name: "Ocultar el panel" }));

    expect(screen.getByRole("button", { name: "Mostrar el panel" })).toBeTruthy();
    expect(screen.queryByRole("tablist", { name: "Pestañas del panel" })).toBeNull();
    expect(storedUi()).toMatchObject({ panelHidden: true });
  });

  test("hidden with a poll the student has not voted shows a red badge with the number on the strip", async () => {
    localStorage.setItem(
      "kurasu:classroom",
      JSON.stringify({ panelHidden: true, presenceCollapsed: false, tab: "questions" }),
    );

    await enter({ activePolls: [choicePoll(planning.id)] });

    const show = screen.getByRole("button", { name: "Mostrar el panel" });

    expect((await within(show).findByLabelText("1 encuestas sin votar")).textContent).toBe("1");
  });

  test("the chosen tab is saved and another session starts on it", async () => {
    const { user, router } = await enter();

    await user.click(screen.getByRole("tab", { name: "Material" }));

    expect(storedUi()).toMatchObject({ tab: "material" });

    await router.navigate({ to: "/" });
    await router.navigate({ to: "/aula" });

    expect(
      (await screen.findByRole("tab", { name: "Material" })).getAttribute("aria-selected"),
    ).toBe("true");
  });

  test("on a phone the panel sits below without hiding, Presentes is a tab and the hand is an icon", async () => {
    phoneViewport();

    await enter();

    const tabs = screen.getByRole("tablist", { name: "Pestañas del panel" });

    expect(
      within(tabs)
        .getAllByRole("tab")
        .map((tab) => tab.textContent),
    ).toEqual(["Encuestas", "Preguntas", "Material", "Presentes"]);
    expect(screen.queryByRole("button", { name: "Ocultar el panel" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Presentes \(/ })).toBeNull();
    expect((await screen.findByRole("button", { name: "Levantar la mano" })).textContent).toBe("");
  });

  test("an invalid saved value starts with the defaults", async () => {
    localStorage.setItem(
      "kurasu:classroom",
      JSON.stringify({ panelHidden: "yes", tab: "nowhere" }),
    );

    await enter();

    expect(screen.getByRole("tab", { name: "Encuestas" }).getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getByRole("button", { name: "Ocultar el panel" })).toBeTruthy();
    expect(screen.getByRole("button", { name: /Presentes/ }).getAttribute("aria-expanded")).toBe(
      "true",
    );
  });
});
