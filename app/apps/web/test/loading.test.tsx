import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { afterEach, describe, expect, test, vi } from "vitest";

import { planning, sessionDetail, tooling, vibeCoding } from "./fixtures/content.ts";
import { student, teacher } from "./fixtures/people.ts";
import { getJson, url } from "./helpers/api.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { studentClassroom } from "./helpers/student-classroom.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const skeletons = () => [...document.querySelectorAll<HTMLElement>('[aria-busy="true"]')];

// Two retries a second and two seconds apart, then the failure reaches the
// screen.
const retriesRunOut = () => vi.advanceTimersByTimeAsync(4000);

const errorScreen = () => screen.findByRole("heading", { name: "No se pudo cargar la página" });

afterEach(() => {
  vi.useRealTimers();
});

describe("loading a screen", () => {
  test("the home draws its fixed parts at once, Sesiones anteriores among them, and each card as one skeleton block while the API has not answered", async () => {
    const sessions = heldResponse("get", "/sessions");

    server.use(sessions.handler, getJson("/me", student), getJson("/polls", []));

    await renderRoute("/");

    const title = await screen.findByRole("heading", { level: 1 });

    await waitFor(() => expect(title.textContent).toBe(`Hola, ${student.name}`));
    expect(screen.getByRole("link", { name: "Ir al inicio" }).textContent).toBe("🐦‍⬛");

    const [highlighted = document.body, earlierCards = document.body] = skeletons();
    const earlier = screen.getByRole("region", { name: "Sesiones anteriores" });

    expect(highlighted.hasAttribute("inert")).toBe(true);
    expect(within(highlighted).getAllByRole("region", { hidden: true })).toHaveLength(1);
    expect(within(earlier).getByRole("heading", { name: "Sesiones anteriores" })).toBeTruthy();
    expect(earlier.contains(earlierCards)).toBe(true);
    expect(earlierCards.hasAttribute("inert")).toBe(true);
    expect(within(earlierCards).getAllByRole("article", { hidden: true })).toHaveLength(2);
    expect(
      [
        ...within(highlighted).getAllByRole("region", { hidden: true }),
        ...within(earlierCards).getAllByRole("article", { hidden: true }),
      ].every((card) => card.classList.contains("skeleton-block")),
    ).toBe(true);
    expect(screen.queryByRole("region", { name: vibeCoding.title })).toBeNull();

    sessions.release(HttpResponse.json([vibeCoding, planning, tooling]));
  });

  test("the users page draws the search and its buttons at once and the list as skeleton rows", async () => {
    const users = heldResponse("get", "/admin/users");

    server.use(users.handler, getJson("/me", teacher));

    await renderRoute("/admin/usuarios");

    expect(await screen.findByLabelText("Buscar por nombre o email")).toBeTruthy();
    expect(screen.getByRole("button", { name: "QR de registro" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Agregar por email" })).toBeTruthy();
    expect(screen.queryByRole("list", { name: "Usuarios" })).toBeNull();

    const list =
      skeletons().find((skeleton) => skeleton.querySelector("ul") != null) ?? document.body;

    expect(list.hasAttribute("inert")).toBe(true);
    expect(within(list).getAllByRole("listitem", { hidden: true })).toHaveLength(4);

    users.release(HttpResponse.json([]));
  });

  test("the classroom shows in skeleton while the list of sessions has not answered, then the real one", async () => {
    const session = sessionDetail(planning);
    const sessions = heldResponse("get", "/sessions");

    server.use(sessions.handler, ...studentClassroom({ session }));

    await renderRoute("/aula");

    const title = await screen.findByRole("heading", { level: 1 });

    expect(screen.getByRole("link", { name: "Volver a las sesiones" })).toBeTruthy();
    expect(title.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(screen.queryByRole("complementary", { name: "Panel del aula" })).toBeNull();
    expect(screen.queryByTitle("Slides")).toBeNull();

    const skeletonRoots = skeletons().map((skeleton) => skeleton.firstElementChild?.tagName);

    expect(skeletonRoots).toEqual(expect.arrayContaining(["SPAN", "DIV", "ASIDE"]));

    const { currentSlide: _slide, currentStep: _step, ...summary } = session;

    sessions.release(HttpResponse.json([summary]));

    expect(await screen.findByRole("heading", { level: 1, name: planning.title })).toBeTruthy();
    expect(await screen.findByTitle("Slides")).toBeTruthy();
    expect(screen.getByRole("complementary", { name: "Panel del aula" })).toBeTruthy();
  });

  test("the cards replace the skeleton once the data arrives", async () => {
    const sessions = heldResponse("get", "/sessions");

    server.use(sessions.handler, getJson("/me", student), getJson("/polls", []));

    await renderRoute("/");

    await waitFor(() => expect(skeletons()).not.toHaveLength(0));

    sessions.release(HttpResponse.json([vibeCoding, planning]));

    expect(await screen.findByRole("region", { name: planning.title })).toBeTruthy();
    expect(screen.getByRole("article", { name: vibeCoding.title })).toBeTruthy();
    expect(skeletons()).toHaveLength(0);
  });

  test("asking again after five minutes keeps the cards on screen, without skeletons", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const again = heldResponse("get", "/sessions");

    server.use(getJson("/me", student), getJson("/sessions", [planning]), getJson("/polls", []));

    await renderRoute("/");

    await screen.findByRole("region", { name: planning.title });

    server.use(again.handler);

    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);

    expect(screen.getByRole("region", { name: planning.title })).toBeTruthy();
    expect(skeletons()).toHaveLength(0);

    again.release(HttpResponse.json([vibeCoding, planning]));

    expect(await screen.findByRole("article", { name: vibeCoding.title })).toBeTruthy();
  });

  test("a load that keeps failing shows the error screen, and once the API answers Volver al inicio takes the teacher to their admin", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const page = teacherSession({ sessions: [{ ...sessionDetail(planning), enabled: true }] });

    server.use(
      failingRoute("get", "/admin/sessions"),
      failingRoute("get", "/admin/sessions/:id"),
      ...page.handlers,
    );

    const { router, user } = await renderRoute(`/admin/sesiones/${planning.id}`);

    await retriesRunOut();

    expect(await errorScreen()).toBeTruthy();
    expect(screen.getByText("Probá de nuevo en un rato.")).toBeTruthy();
    expect(screen.queryByRole("banner")).toBeNull();

    server.use(...page.handlers);

    await user.click(screen.getByRole("button", { name: "Volver al inicio" }));

    await waitFor(() => expect(router.state.location.pathname).toBe("/admin"));
    expect(await screen.findByRole("region", { name: planning.title })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "No se pudo cargar la página" })).toBeNull();
  });

  test("a failing Material sheet replaces the student's page with the error screen", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    server.use(
      getJson("/me", student),
      getJson("/sessions", [planning]),
      getJson("/polls", []),
      failingRoute("get", "/materials"),
    );

    const { user } = await renderRoute("/");

    const highlighted = await screen.findByRole("region", { name: planning.title });

    await user.click(within(highlighted).getByRole("button", { name: "Material" }));
    await retriesRunOut();

    expect(await errorScreen()).toBeTruthy();
    expect(screen.queryByRole("region", { name: planning.title })).toBeNull();
  });

  test("a failing Preguntas tab of the panel replaces the teacher's page with the error screen", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    localStorage.setItem(
      "kurasu:classroom",
      JSON.stringify({ panelHidden: false, presenceCollapsed: false, tab: "questions" }),
    );

    const page = teacherSession({ sessions: [{ ...sessionDetail(planning), enabled: true }] });

    server.use(failingRoute("get", "/admin/questions"), ...page.handlers);

    await renderRoute(`/admin/sesiones/${planning.id}?tab=aula`);

    await retriesRunOut();

    expect(await errorScreen()).toBeTruthy();
    expect(screen.queryByRole("complementary", { name: "Panel del aula" })).toBeNull();
  });

  test("asking again with data on screen that fails keeps the data and no error screen", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    server.use(getJson("/me", student), getJson("/sessions", [planning]), getJson("/polls", []));

    await renderRoute("/");

    await screen.findByRole("region", { name: planning.title });

    server.use(failingRoute("get", "/sessions"));

    await vi.advanceTimersByTimeAsync(5 * 60 * 1000);
    await retriesRunOut();

    expect(screen.getByRole("region", { name: planning.title })).toBeTruthy();
    expect(screen.queryByRole("heading", { name: "No se pudo cargar la página" })).toBeNull();
  });
});

describe("the login check", () => {
  test("the page draws while /api/me has not answered, with the name and the avatar in skeleton", async () => {
    const me = heldResponse("get", "/me");

    server.use(me.handler, getJson("/sessions", [planning]), getJson("/polls", []));

    await renderRoute("/");

    const banner = await screen.findByRole("banner");
    const title = within(banner).getByRole("heading", { level: 1 });

    expect(title.textContent).toBe(`Hola, Lucía Fernández`);
    expect(title.querySelector('[aria-busy="true"]')).not.toBeNull();
    expect(within(banner).queryByRole("button", { name: "Tu cuenta" })).toBeNull();
    expect(banner.querySelectorAll('[aria-busy="true"]')).toHaveLength(2);

    me.release(HttpResponse.json(student));

    expect(await within(banner).findByRole("button", { name: "Tu cuenta" })).toBeTruthy();
    expect(title.textContent).toBe(`Hola, ${student.name}`);
  });

  test("the teacher opening / sees the student's home in skeleton, then goes to /admin", async () => {
    const me = heldResponse("get", "/me");
    const studentLists = { sessions: 0, polls: 0 };

    server.use(
      me.handler,
      http.get(url("/sessions"), () => {
        studentLists.sessions += 1;

        return HttpResponse.json([]);
      }),
      http.get(url("/polls"), () => {
        studentLists.polls += 1;

        return HttpResponse.json([]);
      }),
      getJson("/admin/sessions", []),
    );

    const { router } = await renderRoute("/");

    await waitFor(() => expect(skeletons().length).toBeGreaterThan(0));
    expect(router.state.location.pathname).toBe("/");

    me.release(HttpResponse.json(teacher));

    await waitFor(() => expect(router.state.location.pathname).toBe("/admin"));
    expect(studentLists).toEqual({ sessions: 0, polls: 0 });
  });
});
