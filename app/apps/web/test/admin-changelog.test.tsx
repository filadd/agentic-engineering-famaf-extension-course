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

const composeWith = async (chosenNames: ReadonlyArray<string>) => {
  const opened = await openSession({ changelog: [enabledEntry, slidesEntry, pollEntry] });

  await rows();

  for (const name of chosenNames) {
    await opened.user.click(screen.getByRole("checkbox", { name: `Incluir ${name}` }));
  }

  await opened.user.click(screen.getByRole("button", { name: "Redactar anuncio" }));

  return { ...opened, dialog: screen.getByRole("dialog", { name: "Anuncio" }) };
};

describe("session page: writing and sending the announcement", () => {
  test("sending a message with two of three entries waits, closes, shows the toast and keeps the third entry", async () => {
    const { user, dialog, changelog } = await composeWith([slidesEntry.name, enabledEntry.name]);
    const held = heldResponse("post", "/admin/announcements");

    server.use(held.handler);

    expect(
      within(dialog)
        .getAllByRole("listitem")
        .map((row) => row.textContent),
    ).toEqual([
      expect.stringContaining(enabledEntry.name),
      expect.stringContaining(slidesEntry.name),
    ]);

    await user.type(within(dialog).getByLabelText("Mensaje"), "¡Nos vemos el jueves!");
    await user.click(within(dialog).getByRole("button", { name: "Enviar anuncio" }));

    expect(within(dialog).getByRole("button", { name: "Enviando…" })).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "Cancelar" }).hasAttribute("disabled")).toBe(
      true,
    );
    expect(within(dialog).getByRole("button", { name: "Cerrar" }).hasAttribute("disabled")).toBe(
      true,
    );

    held.release();

    await waitFor(() => expect(screen.queryByRole("dialog", { name: "Anuncio" })).toBeNull());
    expect(await screen.findByText("Anuncio enviado.")).toBeTruthy();
    expect(changelog.announcements).toEqual([
      {
        sessionId: planning.id,
        message: "¡Nos vemos el jueves!",
        entryIds: [enabledEntry.id, slidesEntry.id],
      },
    ]);
    await waitFor(async () =>
      expect((await rows()).map((row) => row.textContent)).toEqual([
        expect.stringContaining(pollEntry.name),
      ]),
    );
  });

  test("sending only a message says no entry was chosen and sends no entry ids", async () => {
    const { user, dialog, changelog } = await composeWith([]);

    expect(within(dialog).getByText("Ninguna novedad elegida.")).toBeTruthy();

    await user.type(within(dialog).getByLabelText("Mensaje"), "Solo un aviso");
    await user.click(within(dialog).getByRole("button", { name: "Enviar anuncio" }));

    await waitFor(() =>
      expect(changelog.announcements).toEqual([
        { sessionId: planning.id, message: "Solo un aviso", entryIds: [] },
      ]),
    );
  });

  test("chosen entries alone are enough to send, with an empty message", async () => {
    const { user, dialog, changelog } = await composeWith([pollEntry.name]);
    const send = within(dialog).getByRole("button", { name: "Enviar anuncio" });

    expect(send.hasAttribute("disabled")).toBe(false);

    await user.click(send);

    await waitFor(() =>
      expect(changelog.announcements).toEqual([
        { sessionId: planning.id, message: "", entryIds: [pollEntry.id] },
      ]),
    );
  });

  test("without a message or chosen entries the announcement cannot be sent", async () => {
    const { dialog } = await composeWith([]);

    expect(
      within(dialog).getByRole("button", { name: "Enviar anuncio" }).hasAttribute("disabled"),
    ).toBe(true);
  });

  test("a failed send keeps the dialog open with its message, its entries and the error, without a toast", async () => {
    const { user, dialog } = await composeWith([slidesEntry.name]);

    server.use(failingRoute("post", "/admin/announcements"));

    await user.type(within(dialog).getByLabelText("Mensaje"), "No sale");
    await user.click(within(dialog).getByRole("button", { name: "Enviar anuncio" }));

    expect(
      await within(dialog).findByText("No se pudo enviar el anuncio. Probá de nuevo."),
    ).toBeTruthy();
    expect(screen.getByRole("dialog", { name: "Anuncio" })).toBe(dialog);
    expect(within(dialog).getByLabelText<HTMLTextAreaElement>("Mensaje").value).toBe("No sale");
    expect(within(dialog).getByText(slidesEntry.name)).toBeTruthy();
    expect(screen.getAllByText("No se pudo enviar el anuncio. Probá de nuevo.")).toHaveLength(1);
    expect(screen.queryByText("Anuncio enviado.")).toBeNull();
  });
});
