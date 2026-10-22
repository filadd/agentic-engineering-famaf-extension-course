import type { ChangelogEntry } from "@kurasu/contract/changelog";
import type { AdminPoll } from "@kurasu/contract/polls";
import { screen, waitFor, within } from "@testing-library/react";
import { http, HttpResponse } from "msw";
import { describe, expect, test } from "vitest";

import { queryKeys } from "../src/api/query-keys.ts";
import { changelogEntry } from "./fixtures/changelog.ts";
import { adminPoll, material, planning, sessionDetail, wordsPoll } from "./fixtures/content.ts";
import { apiError, url } from "./helpers/api.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { materialStore } from "./helpers/material-store.ts";
import { pollStore } from "./helpers/poll-store.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { requestCounter } from "./helpers/request-counter.ts";
import { server } from "./helpers/server.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const enabledEntry = changelogEntry(1, planning.id, "session-enabled", planning.title, 14);
const slidesEntry = changelogEntry(2, planning.id, "material-added", "slides-sesion-2.html", 15);
const pollEntry = changelogEntry(3, planning.id, "poll-opened", "¿Qué agente usás?", 16);

const changelogPath = "/admin/changelog";

interface Options {
  enabled?: boolean;
  changelog?: ReadonlyArray<ChangelogEntry>;
  polls?: ReadonlyArray<AdminPoll>;
  tab?: string;
}

const openSession = async ({
  enabled = true,
  changelog = [],
  polls = [],
  tab = "contenido",
}: Options = {}) => {
  const materials = materialStore([material(1, planning.id, "Apunte.pdf")]);
  const pollsStore = pollStore(polls);
  const page = teacherSession({ sessions: [{ ...sessionDetail(planning), enabled }], changelog });

  server.use(...materials.handlers, ...pollsStore.handlers, ...page.handlers);

  const rendered = await renderRoute(`/admin/sesiones/${planning.id}?tab=${tab}`);

  return { ...rendered, changelog: page.changelog };
};

const column = () => screen.findByRole("region", { name: "Novedades pendientes" });

const rows = async () => within(await column()).findAllByRole("listitem");

const discardDialog = (name: string) =>
  screen.getByRole("alertdialog", { name: `¿Descartar "${name}"?` });

const countChangelogReads = () => {
  const counter = requestCounter(changelogPath);

  server.use(...counter.handlers);

  return counter;
};

// Runs a poll action from the Encuestas tab, where the column is not shown,
// and goes back to Contenido: the list is marked for a new request, and
// returns how many times the column asked for it then.
const runPollAction = async (action: string, confirm: boolean) => {
  const draft = adminPoll(wordsPoll(planning.id), confirm ? "active" : "draft", {
    count: 0,
    words: [],
  });

  const { user, router } = await openSession({ polls: [draft] });

  await within(await column()).findByText("No hay novedades pendientes.");
  await user.click(screen.getByRole("tab", { name: /Encuestas/ }));

  const card = await screen.findByRole("article", { name: draft.prompt });

  if (!confirm) {
    await user.click(within(card).getByRole("button", { expanded: false }));
  }

  await user.click(within(card).getByRole("button", { name: action }));

  if (confirm) {
    await user.click(within(screen.getByRole("alertdialog")).getByRole("button", { name: action }));
  }

  const { queryClient } = router.options.context;

  await waitFor(() =>
    expect(queryClient.getQueryState(queryKeys.adminChangelog(planning.id))?.isInvalidated).toBe(
      true,
    ),
  );

  const counter = countChangelogReads();

  await user.click(screen.getByRole("tab", { name: /Contenido/ }));
  await within(await column()).findByText("No hay novedades pendientes.");

  return counter.count(changelogPath);
};

describe("session page: pending changelog entries", () => {
  test("the column shows a skeleton while the list loads", async () => {
    const held = heldResponse("get", changelogPath);

    server.use(held.handler);
    await openSession();

    const box = await column();

    expect(box.querySelector(".skeleton")).not.toBeNull();
    expect(within(box).queryByText("No hay novedades pendientes.")).toBeNull();

    held.release();

    expect(await within(box).findByText("No hay novedades pendientes.")).toBeTruthy();
  });

  test("a session without entries says so and still lets the teacher write an announcement", async () => {
    await openSession();

    const box = await column();

    expect(await within(box).findByText("No hay novedades pendientes.")).toBeTruthy();
    expect(
      within(box).getByRole("button", { name: "Redactar anuncio" }).hasAttribute("disabled"),
    ).toBe(false);
  });

  test("each entry shows its checkbox, type, date, name, mail line and trash, from the oldest to the newest", async () => {
    await openSession({ changelog: [enabledEntry, slidesEntry, pollEntry] });

    const listed = await rows();

    expect(
      listed.map((row) => within(row).getByRole("checkbox").getAttribute("aria-label")),
    ).toEqual([
      `Incluir ${planning.title}`,
      "Incluir slides-sesion-2.html",
      "Incluir ¿Qué agente usás?",
    ]);

    const second = listed[1] ?? document.body;

    expect(within(second).getByText("Material nuevo")).toBeTruthy();
    expect(within(second).getByText("15/10")).toBeTruthy();
    expect(within(second).getByText("slides-sesion-2.html")).toBeTruthy();
    expect(within(second).getByText('Se agregó el material "slides-sesion-2.html".')).toBeTruthy();
    expect(
      within(second).getByRole("button", { name: "Descartar slides-sesion-2.html" }),
    ).toBeTruthy();
  });

  test("a disabled session with entries asks to enable it and cannot write an announcement", async () => {
    await openSession({ enabled: false, changelog: [slidesEntry] });

    const box = await column();

    await within(box).findAllByRole("listitem");

    expect(within(box).getByText("Habilitá la sesión para mandar un anuncio.")).toBeTruthy();
    expect(
      within(box).getByRole("button", { name: "Redactar anuncio" }).hasAttribute("disabled"),
    ).toBe(true);
  });
});

describe("session page: discarding a changelog entry", () => {
  test("confirming waits for the API with Cancelar disabled, then closes and removes the row", async () => {
    const { user } = await openSession({ changelog: [slidesEntry, pollEntry] });
    const held = heldResponse("delete", `${changelogPath}/${slidesEntry.id}`);

    server.use(held.handler);

    const [row] = await rows();

    await user.click(within(row ?? document.body).getByRole("button", { name: /^Descartar/ }));

    const dialog = discardDialog(slidesEntry.name);

    await user.click(within(dialog).getByRole("button", { name: "Descartar" }));

    expect(within(dialog).getByRole("button", { name: "Descartando…" })).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "Cancelar" }).hasAttribute("disabled")).toBe(
      true,
    );

    held.release();

    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await waitFor(async () =>
      expect((await rows()).map((each) => each.textContent)).toEqual([
        expect.stringContaining(pollEntry.name),
      ]),
    );
  });

  test("an entry that no longer exists closes the dialog without an error and asks for the list again", async () => {
    const { user } = await openSession({ changelog: [slidesEntry] });

    server.use(
      http.delete(url(`${changelogPath}/${slidesEntry.id}`), () =>
        apiError("ChangelogEntryNotFound"),
      ),
    );

    const counter = countChangelogReads();

    await rows();
    await user.click(screen.getByRole("button", { name: `Descartar ${slidesEntry.name}` }));
    await user.click(
      within(discardDialog(slidesEntry.name)).getByRole("button", { name: "Descartar" }),
    );

    await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull());
    await waitFor(() => expect(counter.count(changelogPath)).toBeGreaterThan(0));
    expect(screen.queryByText("No se pudo descartar la novedad. Probá de nuevo.")).toBeNull();
  });

  test("a failed discard keeps the dialog open with its error and no toast", async () => {
    const { user } = await openSession({ changelog: [slidesEntry] });

    server.use(failingRoute("delete", `${changelogPath}/${slidesEntry.id}`));

    await rows();
    await user.click(screen.getByRole("button", { name: `Descartar ${slidesEntry.name}` }));

    const dialog = discardDialog(slidesEntry.name);

    await user.click(within(dialog).getByRole("button", { name: "Descartar" }));

    expect(
      await within(dialog).findByText("No se pudo descartar la novedad. Probá de nuevo."),
    ).toBeTruthy();
    expect(screen.getAllByText("No se pudo descartar la novedad. Probá de nuevo.")).toHaveLength(1);
  });

  test("cancelling closes the dialog without a request", async () => {
    const { user } = await openSession({ changelog: [slidesEntry] });
    let discarded = false;

    server.use(
      http.delete(url(`${changelogPath}/:id`), () => {
        discarded = true;
      }),
    );

    await rows();
    await user.click(screen.getByRole("button", { name: `Descartar ${slidesEntry.name}` }));
    await user.click(
      within(discardDialog(slidesEntry.name)).getByRole("button", { name: "Cancelar" }),
    );

    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(discarded).toBe(false);
    expect(await rows()).toHaveLength(1);
  });
});

describe("session page: the changelog list after other actions", () => {
  test("enabling the session asks for the list again", async () => {
    const { user } = await openSession({ enabled: false });

    await within(await column()).findByText("No hay novedades pendientes.");

    const counter = countChangelogReads();

    await user.click(screen.getByRole("switch", { name: "Deshabilitada" }));

    await waitFor(() => expect(counter.count(changelogPath)).toBeGreaterThan(0));
  });

  test("uploading a material shows its new entry", async () => {
    const { user, changelog } = await openSession();

    await within(await column()).findByText("No hay novedades pendientes.");

    server.use(
      http.post(url("/admin/materials"), () => {
        changelog.add(changelogEntry(9, planning.id, "material-added", "Guía.pdf", 21));

        return HttpResponse.json(material(9, planning.id, "Guía.pdf"), { status: 201 });
      }),
    );

    const box = screen.getByRole("region", { name: "Material" });

    await user.click(within(box).getByRole("button", { name: "Subir archivo" }));

    const dialog = screen.getByRole("dialog", { name: "Subir archivo" });

    await user.upload(
      within(dialog).getByLabelText("Elegí un archivo"),
      new File(["%PDF"], "Guía.pdf", { type: "application/pdf" }),
    );
    await user.click(within(dialog).getByRole("button", { name: "Subir" }));

    expect(
      await within(await column()).findByText('Se agregó el material "Guía.pdf".'),
    ).toBeTruthy();
  });

  test("deleting a material asks for the list again", async () => {
    const { user } = await openSession();

    await within(await column()).findByText("No hay novedades pendientes.");

    const counter = countChangelogReads();

    await user.click(screen.getByRole("button", { name: "Borrar Apunte.pdf" }));
    await user.click(
      within(screen.getByRole("alertdialog", { name: '¿Borrar "Apunte.pdf"?' })).getByRole(
        "button",
        { name: "Borrar" },
      ),
    );

    await waitFor(() => expect(counter.count(changelogPath)).toBeGreaterThan(0));
  });

  test("activating a poll asks for the list again", async () => {
    expect(await runPollAction("Activar", false)).toBe(1);
  });

  test("deleting a poll asks for the list again", async () => {
    expect(await runPollAction("Borrar", true)).toBe(1);
  });
});
