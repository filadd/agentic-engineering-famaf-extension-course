import { waitFor, screen } from "@testing-library/react";
import { http } from "msw";
import { describe, expect, test } from "vitest";

import { planning, sessionDetail, tooling } from "./fixtures/content.ts";
import { student, teacher } from "./fixtures/people.ts";
import { apiError, getJson, url } from "./helpers/api.ts";
import { classroomSocket } from "./helpers/classroom-socket.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { requestCounter } from "./helpers/request-counter.ts";
import { server } from "./helpers/server.ts";
import { studentClassroom } from "./helpers/student-classroom.ts";

const detail = `/sessions/${planning.id}`;
const sessionReads = ["/polls", detail, "/materials", "/questions", "/raised-hands"] as const;

const enter = async (socket = classroomSocket({ people: [teacher, student] })) => {
  const counter = requestCounter("/sessions", ...sessionReads);

  server.use(...studentClassroom({ session: sessionDetail(planning) }), socket.handler);
  server.use(...counter.handlers);

  const rendered = await renderRoute("/aula");

  await screen.findByRole("tab", { name: "Encuestas" });
  await waitFor(() => expect(socket.connections()).toBe(1));
  await waitFor(() => expect(counter.count("/raised-hands")).toBeGreaterThan(0));
  await new Promise((resolve) => setTimeout(resolve, 50));
  counter.reset();

  return { ...rendered, socket, counter };
};

const counts = (counter: ReturnType<typeof requestCounter>) =>
  Object.fromEntries(sessionReads.map((path) => [path, counter.count(path)]));

describe("/aula notices", () => {
  test("a polls notice asks again only for the session's polls", async () => {
    const { socket, counter } = await enter();

    socket.send({ type: "changed", topic: "polls" });

    await waitFor(() => expect(counter.count("/polls")).toBeGreaterThan(0));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(counts(counter)).toMatchObject({
      [detail]: 0,
      "/materials": 0,
      "/questions": 0,
      "/raised-hands": 0,
    });
  });

  test("a slide notice asks again only for the session's detail", async () => {
    const { socket, counter } = await enter();

    socket.send({ type: "changed", topic: "slide" });

    await waitFor(() => expect(counter.count(detail)).toBe(1));
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(counts(counter)).toMatchObject({
      "/polls": 0,
      "/materials": 0,
      "/questions": 0,
      "/raised-hands": 0,
    });
  });

  test("a disabled session answers 404 to its detail and the student goes home", async () => {
    const { socket, router } = await enter();

    server.use(
      http.get(url(detail), () => apiError("SessionNotFound")),
      getJson("/sessions", []),
      getJson("/polls", []),
    );
    socket.send({ type: "changed", topic: "session" });

    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
  });

  // The questions tab is not open, so its list is only marked stale; the
  // lists on screen are asked for again right away.
  test("after a cut, opening again asks for everything of the session", async () => {
    const { socket, counter } = await enter();

    socket.dropAll();

    await waitFor(() => expect(socket.connections()).toBe(2), { timeout: 3000 });
    await waitFor(() =>
      expect(counts(counter)).toMatchObject({
        "/polls": expect.any(Number),
        [detail]: 1,
        "/materials": 1,
        "/raised-hands": 1,
      }),
    );
    expect(counter.count("/polls")).toBeGreaterThan(0);
  });

  test("a message that does not decode is ignored", async () => {
    const { socket, counter } = await enter();

    socket.sendRaw("not json");
    socket.sendRaw(JSON.stringify({ type: "changed", topic: "everything" }));
    socket.sendRaw(JSON.stringify({ type: "presence", people: "nobody" }));

    await new Promise((resolve) => setTimeout(resolve, 100));
    expect(Object.values(counts(counter))).toEqual([0, 0, 0, 0, 0]);
    expect(screen.getByRole("button", { name: /Presentes \(2\)/ })).toBeTruthy();
  });

  test("a socket that never opens asks for the sessions again and goes home when the session is no longer the highlighted one", async () => {
    const counter = requestCounter("/sessions");
    let highlightedChanged = false;

    server.use(
      http.get(url("/sessions"), () => {
        const sessions = highlightedChanged ? [planning, tooling] : [planning];

        highlightedChanged = true;

        return Response.json(sessions);
      }),
      getJson("/polls", []),
      ...studentClassroom({ session: sessionDetail(planning) }),
      classroomSocket({ refuse: true }).handler,
    );
    server.use(...counter.handlers);

    const { router } = await renderRoute("/aula");

    await waitFor(() => expect(counter.count("/sessions")).toBeGreaterThan(1));
    await waitFor(() => expect(router.state.location.pathname).toBe("/"));
  });
});
