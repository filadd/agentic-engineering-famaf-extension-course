import type { Material } from "@kurasu/contract/materials";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { material, planning, sessionDetail } from "./fixtures/content.ts";
import { emptySlides, guidePdf, slidesWithoutManifest, validSlides } from "./fixtures/slides.ts";
import { failingRoute } from "./helpers/failing-route.ts";
import { heldResponse } from "./helpers/held-response.ts";
import { materialStore } from "./helpers/material-store.ts";
import { renderRoute } from "./helpers/render-route.tsx";
import { server } from "./helpers/server.ts";
import { slidesFrame } from "./helpers/slides-frame.ts";
import { teacherSession } from "./helpers/teacher-session.ts";

const oldSlides = material(1, planning.id, "Slides viejas.html", {
  isSlides: true,
  contentType: "text/html",
});

const draftHtml = material(2, planning.id, "Slides nuevas.html", { contentType: "text/html" });
const noApiHtml = material(3, planning.id, "Una página.html", { contentType: "text/html" });

const openContent = async (
  materials: ReadonlyArray<Material>,
  files: Readonly<Record<string, string>> = {},
  options: { tooLarge?: boolean } = {},
) => {
  const store = materialStore(materials, options);
  const page = teacherSession({ sessions: [{ ...sessionDetail(planning), enabled: true }], files });

  server.use(...store.handlers, ...page.handlers);

  const rendered = await renderRoute(`/admin/sesiones/${planning.id}`);
  const box = await screen.findByRole("region", { name: "Material" });

  return { ...rendered, store, box };
};

const chooseFile = async (
  user: Awaited<ReturnType<typeof renderRoute>>["user"],
  box: HTMLElement,
  file: File,
) => {
  await user.click(within(box).getByRole("button", { name: "Subir archivo" }));

  const dialog = screen.getByRole("dialog", { name: "Subir archivo" });

  await user.upload(within(dialog).getByLabelText("Elegí un archivo"), file);
  await within(dialog).findByLabelText("Nombre");

  return dialog;
};

const htmlFile = (html: string, name = "slides-sesion-2.html") =>
  new File([html], name, { type: "text/html" });

const rowNames = (box: HTMLElement) =>
  within(box)
    .queryAllByRole("listitem")
    .map((row) => row.textContent);

afterEach(() => {
  vi.useRealTimers();
});

const slidesSwitch = (dialog: HTMLElement) =>
  within(dialog).getByRole("switch", { name: "Usar como slides del aula" });

const checkingNotice = (place: HTMLElement) =>
  within(place)
    .queryAllByRole("status")
    .find((status) => status.textContent?.includes("Revisando") ?? false);

const okNotice = (place: HTMLElement) =>
  within(place)
    .queryAllByRole("status")
    .find((status) => status.textContent === "El HTML respeta la API de las slides");

describe("session page: material and slides", () => {
  test("choosing a PDF shows its name and the trash in place of the area, without the switch, and Subir uploads it", async () => {
    const { user, box, store } = await openContent([]);

    const dialog = await chooseFile(
      user,
      box,
      new File([guidePdf], "guia.pdf", { type: "application/pdf" }),
    );

    expect(within(dialog).queryByText("Arrastrá un archivo o elegí uno")).toBeNull();
    expect(within(dialog).getByText("guia.pdf")).toBeTruthy();
    expect(within(dialog).getByRole("button", { name: "Quitar archivo" })).toBeTruthy();
    expect(within(dialog).queryByRole("switch")).toBeNull();

    await user.click(within(dialog).getByRole("button", { name: "Subir" }));

    expect(await within(box).findByText("guia.pdf")).toBeTruthy();
    expect(store.uploads).toEqual([
      { sessionId: planning.id, name: "guia.pdf", isSlides: "false", fileName: "guia.pdf" },
    ]);
  });

  test("dropping a file on the area chooses it", async () => {
    const { user, box } = await openContent([]);

    await user.click(within(box).getByRole("button", { name: "Subir archivo" }));

    const dialog = screen.getByRole("dialog", { name: "Subir archivo" });
    const area = within(dialog).getByText("Arrastrá un archivo o elegí uno");

    fireEvent.drop(area, {
      dataTransfer: { files: [new File([guidePdf], "guia.pdf", { type: "application/pdf" })] },
    });

    expect(await within(dialog).findByLabelText("Nombre")).toHaveProperty("value", "guia.pdf");
    expect(within(dialog).getByRole("button", { name: "Quitar archivo" })).toBeTruthy();
  });

  test("the trash takes the file away and brings the area back", async () => {
    const { user, box } = await openContent([]);

    const dialog = await chooseFile(
      user,
      box,
      new File([guidePdf], "guia.pdf", { type: "application/pdf" }),
    );

    await user.click(within(dialog).getByRole("button", { name: "Quitar archivo" }));

    expect(within(dialog).getByText("Arrastrá un archivo o elegí uno")).toBeTruthy();
    expect(within(dialog).queryByLabelText("Nombre")).toBeNull();
    expect(within(dialog).getByRole("button", { name: "Subir" })).toHaveProperty("disabled", true);
  });

  test("valid slides check for a second with everything disabled, then show the green alert and upload as slides", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box, store } = await openContent([oldSlides]);

    const dialog = await chooseFile(user, box, htmlFile(validSlides));
    const upload = within(dialog).getByRole("button", { name: "Subir" });

    await user.click(slidesSwitch(dialog));

    expect(checkingNotice(dialog)).toBeTruthy();
    expect(upload).toHaveProperty("disabled", true);
    expect(slidesSwitch(dialog)).toHaveProperty("disabled", true);
    expect(within(dialog).getByRole("button", { name: "Quitar archivo" })).toHaveProperty(
      "disabled",
      true,
    );

    await (await slidesFrame()).announce();
    await vi.advanceTimersByTimeAsync(1_000);

    await waitFor(() => expect(okNotice(dialog)).toBeTruthy());
    expect(checkingNotice(dialog)).toBeUndefined();
    expect(upload).toHaveProperty("disabled", false);

    await user.click(upload);

    await waitFor(() =>
      expect(rowNames(box)).toEqual([
        "Slides viejas.htmlHTML · 480 KB",
        expect.stringContaining("slides-sesion-2.htmlHTML"),
      ]),
    );
    expect(
      within(within(box).getAllByRole("listitem")[1] ?? box).getByText("Slides del aula"),
    ).toBeTruthy();
    expect(
      within(within(box).getAllByRole("listitem")[0] ?? box).queryByText("Slides del aula"),
    ).toBeNull();
    expect(store.uploads[0]?.isSlides).toBe("true");
  });

  test("the green alert stays until the switch goes off", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box } = await openContent([]);
    const dialog = await chooseFile(user, box, htmlFile(validSlides));

    await user.click(slidesSwitch(dialog));
    await (await slidesFrame()).announce();
    await vi.advanceTimersByTimeAsync(1_000);
    await waitFor(() => expect(okNotice(dialog)).toBeTruthy());
    await vi.advanceTimersByTimeAsync(20_000);

    expect(okNotice(dialog)).toBeTruthy();

    await user.click(slidesSwitch(dialog));

    expect(okNotice(dialog)).toBeUndefined();
    expect(slidesSwitch(dialog).getAttribute("aria-checked")).toBe("false");
  });

  test("an HTML without manifest shows the error after five seconds and turns the switch off", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box } = await openContent([]);
    const dialog = await chooseFile(user, box, htmlFile(slidesWithoutManifest));

    await user.click(slidesSwitch(dialog));
    await slidesFrame();
    await vi.advanceTimersByTimeAsync(4_900);

    expect(within(dialog).queryByRole("alert")).toBeNull();

    await vi.advanceTimersByTimeAsync(200);

    expect((await within(dialog).findByRole("alert")).textContent).toContain(
      "no respeta la API de las slides",
    );
    expect(slidesSwitch(dialog).getAttribute("aria-checked")).toBe("false");
    expect(within(dialog).getByRole("button", { name: "Subir" })).toHaveProperty("disabled", false);
  });

  test("a manifest with no slides shows the error a second after the check starts", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box } = await openContent([]);
    const dialog = await chooseFile(user, box, htmlFile(emptySlides));

    await user.click(slidesSwitch(dialog));
    await (await slidesFrame()).announce();

    expect(within(dialog).queryByRole("alert")).toBeNull();

    await vi.advanceTimersByTimeAsync(1_000);

    expect((await within(dialog).findByRole("alert")).textContent).toContain(
      "no respeta la API de las slides",
    );
    expect(slidesSwitch(dialog).getAttribute("aria-checked")).toBe("false");
  });

  test("an HTML left unmarked uploads as plain material, without a check", async () => {
    const { user, box, store } = await openContent([]);
    const dialog = await chooseFile(user, box, htmlFile(validSlides));

    expect(slidesSwitch(dialog).getAttribute("aria-checked")).toBe("false");

    await user.click(within(dialog).getByRole("button", { name: "Subir" }));

    await waitFor(() => expect(store.uploads).toHaveLength(1));
    expect(store.uploads[0]?.isSlides).toBe("false");
    expect(screen.queryByTitle("Slides")).toBeNull();
  });

  test("a manifest that arrives at once still shows Revisando for a second", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box } = await openContent([]);
    const dialog = await chooseFile(user, box, htmlFile(validSlides));

    await user.click(slidesSwitch(dialog));
    await (await slidesFrame()).announce();
    await vi.advanceTimersByTimeAsync(800);

    expect(checkingNotice(dialog)).toBeTruthy();
    expect(okNotice(dialog)).toBeUndefined();

    await vi.advanceTimersByTimeAsync(300);

    await waitFor(() => expect(okNotice(dialog)).toBeTruthy());
  });

  test("a file over 100 MB shows the size error in the modal", async () => {
    const { user, box } = await openContent([], {}, { tooLarge: true });

    const dialog = await chooseFile(
      user,
      box,
      new File([guidePdf], "grabacion.mp4", { type: "video/mp4" }),
    );

    await user.click(within(dialog).getByRole("button", { name: "Subir" }));

    expect((await within(dialog).findByRole("alert")).textContent).toContain("más de 100 MB");
  });

  test("marking an uploaded HTML checks it for a second, patches isSlides and shows the green alert for ten seconds", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box, store } = await openContent([oldSlides, draftHtml], {
      [draftHtml.id]: validSlides,
    });

    await user.click(
      await within(box).findByRole("button", {
        name: `Usar ${draftHtml.name} como slides del aula`,
      }),
    );
    await (await slidesFrame()).announce();

    expect(checkingNotice(box)).toBeTruthy();
    expect(store.writes).toEqual([]);

    await vi.advanceTimersByTimeAsync(1_000);

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { isSlides: true } }]),
    );
    await waitFor(() =>
      expect(
        within(within(box).getAllByRole("listitem")[1] ?? box).getByText("Slides del aula"),
      ).toBeTruthy(),
    );
    expect(okNotice(box)).toBeTruthy();

    await vi.advanceTimersByTimeAsync(10_000);

    await waitFor(() => expect(okNotice(box)).toBeUndefined());
  });

  test("marking one without manifest shows the error until the next mark, and patches nothing", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box, store } = await openContent([noApiHtml, draftHtml], {
      [noApiHtml.id]: slidesWithoutManifest,
      [draftHtml.id]: validSlides,
    });

    await user.click(
      await within(box).findByRole("button", {
        name: `Usar ${noApiHtml.name} como slides del aula`,
      }),
    );
    await slidesFrame();
    await vi.advanceTimersByTimeAsync(5_100);

    expect((await within(box).findByRole("alert")).textContent).toContain(
      "no respeta la API de las slides",
    );

    await vi.advanceTimersByTimeAsync(30_000);

    expect(within(box).getByRole("alert")).toBeTruthy();
    expect(store.writes).toEqual([]);

    await user.click(
      within(box).getByRole("button", { name: `Usar ${draftHtml.name} como slides del aula` }),
    );

    await waitFor(() => expect(within(box).queryByRole("alert")).toBeNull());
  });

  test("a failed download of the HTML shows a toast and leaves the list as it was", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box, store } = await openContent([draftHtml]);

    server.use(failingRoute("get", "/materials/:id/file"));

    await user.click(
      await within(box).findByRole("button", {
        name: `Usar ${draftHtml.name} como slides del aula`,
      }),
    );
    await vi.advanceTimersByTimeAsync(4_000);

    expect(await screen.findByText("No se pudo abrir el archivo.")).toBeTruthy();
    await waitFor(() => expect(checkingNotice(box)).toBeUndefined());
    expect(
      within(box).getByRole("button", { name: `Usar ${draftHtml.name} como slides del aula` }),
    ).toHaveProperty("disabled", false);
    expect(store.writes).toEqual([]);
  });

  test("while one HTML is checked, the buttons to mark the others are disabled", async () => {
    const { user, box } = await openContent([draftHtml, noApiHtml], {
      [draftHtml.id]: validSlides,
      [noApiHtml.id]: slidesWithoutManifest,
    });

    await user.click(
      await within(box).findByRole("button", {
        name: `Usar ${draftHtml.name} como slides del aula`,
      }),
    );

    await waitFor(() =>
      expect(
        within(box).getByRole("button", { name: `Usar ${noApiHtml.name} como slides del aula` }),
      ).toHaveProperty("disabled", true),
    );
    expect(
      within(box).getByRole("button", { name: `Usar ${draftHtml.name} como slides del aula` }),
    ).toHaveProperty("disabled", true);
  });

  test("deleting a material asks for confirmation, waits for the delete and removes it from the list", async () => {
    const guide = material(4, planning.id, "Guía.pdf");
    const { user, box, store } = await openContent([guide]);
    const held = heldResponse("delete", `/admin/materials/${guide.id}`);

    server.use(held.handler);
    await user.click(await within(box).findByRole("button", { name: "Borrar Guía.pdf" }));

    const confirm = screen.getByRole("alertdialog", { name: '¿Borrar "Guía.pdf"?' });

    expect(confirm.textContent).toContain("Los estudiantes dejan de verlo en el material.");

    await user.click(within(confirm).getByRole("button", { name: "Borrar" }));

    const deleting = await within(confirm).findByRole("button", { name: "Borrando…" });

    expect(deleting.getAttribute("aria-busy")).toBe("true");
    expect(deleting).toHaveProperty("disabled", true);
    expect(within(confirm).getByRole("button", { name: "Cancelar" })).toHaveProperty(
      "disabled",
      true,
    );
    expect(within(box).getByText("Guía.pdf")).toBeTruthy();

    held.release();

    await waitFor(() => expect(within(box).queryByText("Guía.pdf")).toBeNull());
    expect(screen.queryByRole("alertdialog")).toBeNull();
    expect(store.writes).toEqual([{ method: "DELETE", body: guide.id }]);
  });

  test("a failed delete keeps the confirmation open with its error", async () => {
    const guide = material(4, planning.id, "Guía.pdf");
    const { user, box } = await openContent([guide]);

    server.use(failingRoute("delete", `/admin/materials/${guide.id}`));
    await user.click(await within(box).findByRole("button", { name: "Borrar Guía.pdf" }));

    const confirm = screen.getByRole("alertdialog", { name: '¿Borrar "Guía.pdf"?' });

    await user.click(within(confirm).getByRole("button", { name: "Borrar" }));

    expect((await within(confirm).findByRole("alert")).textContent).toBe(
      "No se pudo borrar el material. Probá de nuevo.",
    );
    expect(within(confirm).getByRole("button", { name: "Borrar" })).toHaveProperty(
      "disabled",
      false,
    );
    expect(within(box).getByText("Guía.pdf")).toBeTruthy();
  });
});
