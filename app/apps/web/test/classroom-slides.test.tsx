import { screen, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import { planning, sessionDetail } from "./fixtures/content.ts";
import { ulid } from "./fixtures/ids.ts";
import { otherStudent, student, teacher } from "./fixtures/people.ts";
import { validSlides } from "./fixtures/slides.ts";
import { getJson, url } from "./helpers/api.ts";
import { classroomSocket } from "./helpers/classroom-socket.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { slidesFrame } from "./helpers/slides-frame.ts";
import { slidesMaterial, studentClassroom } from "./helpers/student-classroom.ts";

const withTeacher = [
  { ...teacher, role: "teacher" as const },
  { ...student, role: "student" as const },
];

const withoutTeacher = [{ ...student, role: "student" as const }, otherStudent];

const enter = async (slide: number, step: number, people = withTeacher) => {
  const socket = classroomSocket({ people });

  server.use(
    ...studentClassroom({ session: sessionDetail(planning, slide, step) }),
    socket.handler,
  );

  const { user } = await renderRoute("/aula");
  const slides = await slidesFrame();

  await slides.announce();

  await screen.findByText(/ \/ 3$/);

  return { user, slides, socket };
};

const followButton = () => screen.queryByRole("button", { name: /al profe/ });

describe("/aula slides", () => {
  test("entering with the teacher follows the teacher and sends the teacher's position to the slides", async () => {
    const { slides } = await enter(2, 2);

    await waitFor(() => expect(slides.lastGo()).toEqual({ slide: 2, step: 2 }));
    expect(followButton()?.textContent).toBe("Siguiendo al profe");
  });

  test("navigating by hand stops following and moves the slides to the new position", async () => {
    const { user, slides } = await enter(2, 2);

    await waitFor(() => expect(followButton()?.textContent).toBe("Siguiendo al profe"));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => expect(slides.lastGo()).toEqual({ slide: 2, step: 3 }));
    expect(followButton()?.textContent).toBe("Seguir al profe");
  });

  test("reaching the teacher's position follows again", async () => {
    const { user, slides } = await enter(2, 2);

    await waitFor(() => expect(followButton()).not.toBeNull());
    await user.click(screen.getByRole("button", { name: "Siguiente" }));
    await waitFor(() => expect(followButton()?.textContent).toBe("Seguir al profe"));
    await user.click(screen.getByRole("button", { name: "Anterior" }));

    await waitFor(() => expect(followButton()?.textContent).toBe("Siguiendo al profe"));
    expect(slides.lastGo()).toEqual({ slide: 2, step: 2 });
  });

  test("when the teacher moves, a follower goes to the new position and the rest stay", async () => {
    const { user, slides, socket } = await enter(2, 2);

    await waitFor(() => expect(followButton()?.textContent).toBe("Siguiendo al profe"));

    server.use(getJson(`/sessions/${planning.id}`, sessionDetail(planning, 3, 1)));
    socket.send({ type: "changed", topic: "slide" });

    await waitFor(() => expect(slides.lastGo()).toEqual({ slide: 3, step: 1 }));

    await user.click(screen.getByRole("button", { name: "Anterior" }));
    await waitFor(() => expect(slides.lastGo()).toEqual({ slide: 2, step: 1 }));

    server.use(getJson(`/sessions/${planning.id}`, sessionDetail(planning, 2, 3)));
    socket.send({ type: "changed", topic: "slide" });

    await waitFor(() => expect(screen.getByText("2 / 3")).toBeTruthy());
    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(slides.lastGo()).toEqual({ slide: 2, step: 1 });
  });

  test("without the teacher there is no follow control and the student moves alone from the saved position", async () => {
    const { user, slides } = await enter(2, 2, withoutTeacher);

    await waitFor(() => expect(slides.lastGo()).toEqual({ slide: 2, step: 2 }));
    expect(followButton()).toBeNull();

    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    await waitFor(() => expect(slides.lastGo()).toEqual({ slide: 2, step: 3 }));
  });

  test("next on the last step of the last slide stays in place", async () => {
    const { user, slides } = await enter(3, 1, withoutTeacher);

    await waitFor(() => expect(slides.lastGo()).toEqual({ slide: 3, step: 1 }));
    await user.click(screen.getByRole("button", { name: "Siguiente" }));

    expect(slides.lastGo()).toEqual({ slide: 3, step: 1 });
    expect(screen.getByText("3 / 3")).toBeTruthy();
  });

  test("previous on slide 1, step 1 stays in place", async () => {
    const { user, slides } = await enter(1, 1, withoutTeacher);

    await waitFor(() => expect(slides.lastGo()).toEqual({ slide: 1, step: 1 }));
    await user.click(screen.getByRole("button", { name: "Anterior" }));

    expect(slides.lastGo()).toEqual({ slide: 1, step: 1 });
  });

  test("when the teacher changes the slides the new HTML loads at 1, 1", async () => {
    const { socket } = await enter(2, 2);
    const newSlides = validSlides.replace("Slides de prueba", "Slides nuevas");
    const newMaterial = { ...slidesMaterial(planning.id), id: ulid("M", 99) };

    server.use(
      getJson("/materials", [newMaterial]),
      http.get(url(`/materials/${newMaterial.id}/file`), () => HttpResponse.text(newSlides)),
      getJson(`/sessions/${planning.id}`, sessionDetail(planning, 1, 1)),
    );
    socket.send({ type: "changed", topic: "material" });
    socket.send({ type: "changed", topic: "slide" });

    await waitFor(() =>
      expect(screen.getByTitle("Slides").getAttribute("srcdoc")).toContain("Slides nuevas"),
    );

    const fresh = await slidesFrame();

    await fresh.announce();

    await waitFor(() => expect(fresh.lastGo()).toEqual({ slide: 1, step: 1 }));
  });

  test("a session without slides shows an empty stage without navigation", async () => {
    server.use(
      ...studentClassroom({ session: sessionDetail(planning), slides: null }),
      classroomSocket({ people: withTeacher }).handler,
    );

    await renderRoute("/aula");

    expect(await screen.findByText("Esta sesión todavía no tiene slides.")).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Siguiente" })).toBeNull();
    expect(screen.queryByTitle("Slides")).toBeNull();
  });

  test("a message from another window or a malformed one is ignored", async () => {
    server.use(
      ...studentClassroom({ session: sessionDetail(planning, 2, 2) }),
      classroomSocket({ people: withTeacher }).handler,
    );

    await renderRoute("/aula");

    const slides = await slidesFrame();
    const manifest = { type: "kurasu:manifest" as const, slides: [{ steps: 1 }] };

    slides.postFrom(window, manifest);
    slides.postFrom(slides.frame.contentWindow, "not a message");
    slides.postFrom(slides.frame.contentWindow, { type: "kurasu:go", slide: 1, step: 1 });

    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(screen.queryByRole("button", { name: "Siguiente" })).toBeNull();

    await slides.announce();

    expect(await screen.findByText("2 / 3")).toBeTruthy();
  });
});
