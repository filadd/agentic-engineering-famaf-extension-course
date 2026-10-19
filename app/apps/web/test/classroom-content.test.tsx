import type { RequestHandler, WebSocketHandler } from "msw";
import { screen, waitFor, within } from "@testing-library/react";
import { describe, expect, test } from "vitest";

import { material, planning, question, sessionDetail } from "./fixtures/content.ts";
import { student, teacher } from "./fixtures/people.ts";
import { getJson } from "./helpers/api.ts";
import { classroomSocket } from "./helpers/classroom-socket.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { questionStore } from "./helpers/question-store.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { studentClassroom } from "./helpers/student-classroom.ts";

const enter = async (tab: string, ...handlers: Array<RequestHandler | WebSocketHandler>) => {
  const socket = classroomSocket({ people: [teacher, student] });

  server.use(
    ...handlers,
    ...studentClassroom({ session: sessionDetail(planning), slides: null }),
    socket.handler,
  );

  const { user } = await renderRoute("/aula");

  await user.click(await screen.findByRole("tab", { name: tab }));

  return { user, socket, panel: screen.getByRole("tabpanel") };
};

describe("questions in the classroom", () => {
  test("asking posts the question and it shows as the student's own, without voting", async () => {
    const store = questionStore([]);
    const { user, panel } = await enter("Preguntas", ...store.handlers);

    await user.type(within(panel).getByLabelText("Hacé una pregunta"), "¿Y los tests?");
    await user.click(within(panel).getByRole("button", { name: "Enviar" }));

    const asked = await within(panel).findByRole("listitem", { name: "¿Y los tests?" });

    expect(within(asked).getByText("Tuya")).toBeTruthy();
    expect(within(asked).getByRole("button", { name: "Votos: 0" })).toHaveProperty(
      "disabled",
      true,
    );
  });

  test("a failed question stays written with the error under the field", async () => {
    const store = questionStore([]);
    const { user, panel } = await enter("Preguntas", ...store.handlers);

    server.use(failingRoute("post", "/questions"));
    await user.type(within(panel).getByLabelText("Hacé una pregunta"), "¿Y los tests?");
    await user.click(within(panel).getByRole("button", { name: "Enviar" }));

    expect((await within(panel).findByRole("alert")).textContent).toBe(
      "No se pudo enviar tu pregunta. Probá de nuevo.",
    );
    expect(within(panel).getByLabelText("Hacé una pregunta")).toHaveProperty(
      "value",
      "¿Y los tests?",
    );
    expect(store.current()).toEqual([]);
  });

  test("voting and taking the vote back adds and removes it, ordered by votes", async () => {
    const store = questionStore([
      question(1, planning.id, "¿Cuánto detalle tiene un plan?", { votes: 2 }),
      question(2, planning.id, "¿Diff o tests primero?", { votes: 2 }),
    ]);

    const { user, panel } = await enter("Preguntas", ...store.handlers);

    const second = await within(panel).findByRole("listitem", { name: "¿Diff o tests primero?" });

    await user.click(within(second).getByRole("button", { name: "Votos: 2" }));

    await waitFor(() =>
      expect(within(panel).getAllByRole("listitem")[0]?.getAttribute("aria-label")).toBe(
        "¿Diff o tests primero?",
      ),
    );

    await user.click(within(panel).getByRole("button", { name: "Votos: 3" }));

    expect(await within(panel).findAllByRole("button", { name: "Votos: 2" })).toHaveLength(2);
  });

  test("voting a question marks the vote and counts it before the answer", async () => {
    const voting = question(1, planning.id, "¿Cuánto detalle tiene un plan?", { votes: 2 });
    const store = questionStore([voting]);
    const { user, panel } = await enter("Preguntas", ...store.handlers);
    const held = heldResponse("patch", `/questions/${voting.id}`);

    server.use(held.handler);
    await user.click(await within(panel).findByRole("button", { name: "Votos: 2" }));

    const vote = await within(panel).findByRole("button", { name: "Votos: 3" });

    expect(vote.getAttribute("aria-pressed")).toBe("true");
    expect(store.current()[0]?.votes).toBe(2);

    held.release();

    await waitFor(() => expect(store.current()[0]?.votes).toBe(3));
  });

  test("deleting the own question asks for confirmation, sends the delete and removes it", async () => {
    const own = question(1, planning.id, "¿Me olvidé de algo?", { mine: true });
    const store = questionStore([own]);
    const { user, panel } = await enter("Preguntas", ...store.handlers);

    await user.click(
      within(await within(panel).findByRole("listitem", { name: own.body })).getByRole("button", {
        name: "Borrar tu pregunta",
      }),
    );
    await user.click(
      within(screen.getByRole("alertdialog", { name: "¿Borrar tu pregunta?" })).getByRole(
        "button",
        {
          name: "Borrar",
        },
      ),
    );

    await waitFor(() =>
      expect(within(panel).queryByRole("listitem", { name: own.body })).toBeNull(),
    );
    expect(store.current()).toEqual([]);
  });

  test("a questions notice asks for the list again and the answered one goes away", async () => {
    const answered = question(1, planning.id, "¿Ya la respondiste?");
    const open = question(2, planning.id, "¿Y esta otra?");
    const store = questionStore([answered, open]);
    const { panel, socket } = await enter("Preguntas", ...store.handlers);

    await within(panel).findByRole("listitem", { name: answered.body });

    server.use(getJson("/questions", [open]));
    socket.send({ type: "changed", topic: "questions" });

    await waitFor(() =>
      expect(within(panel).queryByRole("listitem", { name: answered.body })).toBeNull(),
    );
    expect(within(panel).getByRole("listitem", { name: open.body })).toBeTruthy();
  });
});

describe("material in the classroom", () => {
  test("each row downloads its file", async () => {
    const guide = material(1, planning.id, "Guía.pdf");
    const exercise = material(2, planning.id, "Ejercicio.zip", { contentType: "application/zip" });
    const { panel } = await enter("Material", getJson("/materials", [guide, exercise]));

    await waitFor(() =>
      expect(
        within(panel)
          .getAllByRole("link")
          .map((link) => link.getAttribute("href")),
      ).toEqual([`/api/materials/${guide.id}/file`, `/api/materials/${exercise.id}/file`]),
    );
  });

  test("a material notice shows the new file", async () => {
    const guide = material(1, planning.id, "Guía.pdf");
    const { panel, socket } = await enter("Material", getJson("/materials", [guide]));

    await within(panel).findByText("Guía.pdf");

    server.use(getJson("/materials", [guide, material(2, planning.id, "Lectura.pdf")]));
    socket.send({ type: "changed", topic: "material" });

    expect(await within(panel).findByText("Lectura.pdf")).toBeTruthy();
  });
});
