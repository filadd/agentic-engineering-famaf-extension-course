import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { planning, sessionDetail } from "./fixtures/content.ts";
import { otherStudent, student, teacher } from "./fixtures/people.ts";
import { classroomSocket } from "./helpers/classroom-socket.ts";
import { handStore } from "./helpers/hand-store.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { studentClassroom } from "./helpers/student-classroom.ts";

const people = [teacher, student, otherStudent];

const enter = async (hands: ReturnType<typeof handStore>) => {
  const socket = classroomSocket({ people });

  server.use(
    ...hands.handlers,
    ...studentClassroom({ session: sessionDetail(planning), slides: null }),
    socket.handler,
  );

  const rendered = await renderRoute("/aula");
  const presence = await screen.findByRole("list", { name: "Presentes" });

  await within(presence).findByRole("listitem", { name: "Agustín" });

  return { ...rendered, socket, presence };
};

const rowOf = (presence: HTMLElement, name: string) =>
  within(presence).getByRole("listitem", { name });

describe("/aula present people and the hand", () => {
  test("Presentes shows each avatar, name, the Profe and Vos labels and each raised hand", async () => {
    const { presence } = await enter(
      handStore([{ sessionId: planning.id, userId: otherStudent.id }]),
    );

    expect(
      within(presence)
        .getAllByRole("listitem")
        .map((row) => row.textContent),
    ).toEqual(["🦉AgustínProfe", "🦊LucíaVos", "🐼Tomás"]);
    await waitFor(() =>
      expect(within(rowOf(presence, "Tomás")).getByLabelText("Mano levantada")).toBeTruthy(),
    );
    expect(within(rowOf(presence, "Lucía")).queryByLabelText("Mano levantada")).toBeNull();
  });

  test("raising the hand posts it, marks the own row and turns the button on", async () => {
    const hands = handStore([]);
    const { user, presence } = await enter(hands);

    await user.click(screen.getByRole("button", { name: "Levantar la mano" }));

    await waitFor(() =>
      expect(within(rowOf(presence, "Lucía")).getByLabelText("Mano levantada")).toBeTruthy(),
    );
    expect(screen.getByRole("button", { name: "Bajar la mano" }).getAttribute("aria-pressed")).toBe(
      "true",
    );
    expect(hands.writes).toEqual(["POST"]);
  });

  test("lowering the hand deletes it and the mark goes away", async () => {
    const hands = handStore([{ sessionId: planning.id, userId: student.id }]);
    const { user, presence } = await enter(hands);

    await user.click(await screen.findByRole("button", { name: "Bajar la mano" }));

    await waitFor(() =>
      expect(within(rowOf(presence, "Lucía")).queryByLabelText("Mano levantada")).toBeNull(),
    );
    expect(hands.writes).toEqual(["DELETE"]);
  });

  test("when the teacher lowers it, the hands notice asks for the hands and the mark goes away", async () => {
    const hands = handStore([{ sessionId: planning.id, userId: student.id }]);
    const { presence, socket } = await enter(hands);

    await waitFor(() =>
      expect(within(rowOf(presence, "Lucía")).getByLabelText("Mano levantada")).toBeTruthy(),
    );

    hands.set([]);
    socket.send({ type: "changed", topic: "hands" });

    await waitFor(() =>
      expect(within(rowOf(presence, "Lucía")).queryByLabelText("Mano levantada")).toBeNull(),
    );
    expect(screen.getByRole("button", { name: "Levantar la mano" })).toBeTruthy();
  });

  test("folding Presentes keeps it folded when coming back", async () => {
    const socket = classroomSocket({ people: [student] });

    server.use(
      ...studentClassroom({ session: sessionDetail(planning), slides: null }),
      socket.handler,
    );

    const first = await renderRoute("/aula");
    const fold = await screen.findByRole("button", { name: /Presentes \(1\)/ });

    await first.user.click(fold);

    expect(screen.queryByRole("list", { name: "Presentes" })).toBeNull();
    expect(JSON.parse(localStorage.getItem("kurasu:classroom") ?? "{}").presenceCollapsed).toBe(
      true,
    );

    await first.router.navigate({ to: "/" });
    await first.router.navigate({ to: "/aula" });

    expect(
      (await screen.findByRole("button", { name: /Presentes/ })).getAttribute("aria-expanded"),
    ).toBe("false");
  });
});
