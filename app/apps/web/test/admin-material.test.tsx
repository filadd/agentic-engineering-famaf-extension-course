import type { Material } from "@kurasu/contract/materials";
import { screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { material, planning, sessionDetail } from "./fixtures/content.ts";
import { emptySlides, guidePdf, slidesWithoutManifest, validSlides } from "./fixtures/slides.ts";
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

describe("session page: material and slides", () => {
  test("uploading a PDF adds it to the list", async () => {
    const { user, box, store } = await openContent([]);

    const dialog = await chooseFile(
      user,
      box,
      new File([guidePdf], "guia.pdf", { type: "application/pdf" }),
    );

    await user.click(within(dialog).getByRole("button", { name: "Subir" }));

    expect(await within(box).findByText("guia.pdf")).toBeTruthy();
    expect(store.uploads).toEqual([
      { sessionId: planning.id, name: "guia.pdf", isSlides: "false", fileName: "guia.pdf" },
    ]);
  });

  test("uploading valid slides checks them, enables Subir and marks the new row as slides", async () => {
    const { user, box, store } = await openContent([oldSlides]);

    const dialog = await chooseFile(user, box, htmlFile(validSlides));
    const upload = within(dialog).getByRole("button", { name: "Subir" });

    await user.click(within(dialog).getByRole("switch", { name: "Usar como slides del aula" }));

    expect(within(dialog).getByRole("status").textContent).toContain("Revisando");
    expect(upload).toHaveProperty("disabled", true);

    await (await slidesFrame()).announce();

    await waitFor(() => expect(upload).toHaveProperty("disabled", false));
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

  test("an HTML without manifest shows the error in the modal after five seconds and keeps Subir disabled", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box } = await openContent([]);
    const dialog = await chooseFile(user, box, htmlFile(slidesWithoutManifest));

    await user.click(within(dialog).getByRole("switch", { name: "Usar como slides del aula" }));
    await slidesFrame();
    await vi.advanceTimersByTimeAsync(4_900);

    expect(within(dialog).queryByRole("alert")).toBeNull();

    await vi.advanceTimersByTimeAsync(200);

    expect((await within(dialog).findByRole("alert")).textContent).toContain(
      "no respeta la API de las slides",
    );
    expect(within(dialog).getByRole("button", { name: "Subir" })).toHaveProperty("disabled", true);
  });

  test("a manifest with no slides shows the error in the modal", async () => {
    const { user, box } = await openContent([]);
    const dialog = await chooseFile(user, box, htmlFile(emptySlides));

    await user.click(within(dialog).getByRole("switch", { name: "Usar como slides del aula" }));
    await (await slidesFrame()).announce();

    expect((await within(dialog).findByRole("alert")).textContent).toContain(
      "no respeta la API de las slides",
    );
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

  test("marking an uploaded HTML downloads its text, checks it and patches isSlides", async () => {
    const { user, box, store } = await openContent([oldSlides, draftHtml], {
      [draftHtml.id]: validSlides,
    });

    await user.click(
      await within(box).findByRole("button", {
        name: `Usar ${draftHtml.name} como slides del aula`,
      }),
    );
    await (await slidesFrame()).announce();

    await waitFor(() =>
      expect(store.writes).toEqual([{ method: "PATCH", body: { isSlides: true } }]),
    );
    await waitFor(() =>
      expect(
        within(within(box).getAllByRole("listitem")[1] ?? box).getByText("Slides del aula"),
      ).toBeTruthy(),
    );
  });

  test("marking one without manifest shows the error and patches nothing", async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });

    const { user, box, store } = await openContent([noApiHtml], {
      [noApiHtml.id]: slidesWithoutManifest,
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
    expect(store.writes).toEqual([]);
  });

  test("deleting a material asks for confirmation, deletes it and removes it from the list", async () => {
    const guide = material(4, planning.id, "Guía.pdf");
    const { user, box, store } = await openContent([guide]);

    await user.click(await within(box).findByRole("button", { name: "Borrar Guía.pdf" }));

    const confirm = screen.getByRole("alertdialog", { name: '¿Borrar "Guía.pdf"?' });

    expect(confirm.textContent).toContain("Los estudiantes dejan de verlo en el material.");

    await user.click(within(confirm).getByRole("button", { name: "Borrar" }));

    await waitFor(() => expect(within(box).queryByText("Guía.pdf")).toBeNull());
    expect(store.writes).toEqual([{ method: "DELETE", body: guide.id }]);
  });
});
