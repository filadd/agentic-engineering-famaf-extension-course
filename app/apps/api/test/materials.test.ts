import { expect } from "@effect/vitest";
import { FileTooLarge, SessionNotFound } from "@kurasu/contract/errors";
import { Material } from "@kurasu/contract/materials";
import { Session } from "@kurasu/contract/sessions";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { apiTest } from "./helpers/api-test.ts";
import { bodyOf, failedWith } from "./helpers/body.ts";
import { download, request, upload, type UploadFile } from "./helpers/http.ts";
import { cookieFor } from "./helpers/login.ts";

const { test, stack } = apiTest({ name: "materials", allowedEmails: [] });

const teacher = "01MTCH00000000000000000000";
const student = "01MSTD00000000000000000000";

const withMaterial = "01MSA000000000000000000000";
const disabled = "01MSB000000000000000000000";
const deleted = "01MSC000000000000000000000";
const withoutSlides = "01MSD000000000000000000000";
const withSlides = "01MSE000000000000000000000";
const twoHtml = "01MSF000000000000000000000";
const slidesToUnmark = "01MSG000000000000000000000";
const slidesToDelete = "01MSH000000000000000000000";

const Materials = Schema.Array(Material);

// Bytes that differ along the whole file, so a download that loses or reorders
// a part does not come back identical.
const fileOf = (name: string, type: string, size: number): UploadFile => ({
  name,
  type,
  bytes: Uint8Array.from({ length: size }, (_, index) => (index * 31 + (index >> 12)) % 251),
});

const pdf = (name: string, size = 64 * 1024) => fileOf(name, "application/pdf", size);

const html = (name: string) => fileOf(name, "text/html", 2048);

const teacherUpload = (
  url: string,
  sessionId: string,
  name: string,
  isSlides: boolean,
  file: UploadFile,
) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(teacher);

    return yield* upload(url, cookie, { sessionId, name, isSlides, file });
  });

const listAs = (url: string, userId: string, path: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(userId);
    const response = yield* request(url, "GET", path, { cookie });

    expect(response.status).toBe(200);

    return yield* bodyOf(Materials, response);
  });

const teacherMaterials = (url: string, sessionId: string) =>
  listAs(url, teacher, `/api/admin/materials?sessionId=${sessionId}`);

const position = (url: string, sessionId: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(teacher);
    const response = yield* request(url, "GET", `/api/admin/sessions/${sessionId}`, { cookie });
    const session = yield* bodyOf(Session, response);

    return [session.currentSlide, session.currentStep];
  });

const slidesOf = (materials: ReadonlyArray<Material>) =>
  materials.flatMap((material) => (material.isSlides ? [material.id] : []));

test(
  "the student lists the material of a session, saying which file is the slides",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const materials = yield* listAs(url, student, `/api/materials?sessionId=${withMaterial}`);

    expect(materials).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "01MMA100000000000000000000", isSlides: false }),
        expect.objectContaining({ id: "01MMA200000000000000000000", isSlides: true }),
      ]),
    );
  }),
);

test(
  "the material of a disabled session answers SessionNotFound to the student",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(student);
    const response = yield* request(url, "GET", `/api/materials?sessionId=${disabled}`, { cookie });

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "the student downloads an identical file as an attachment with its name and type",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const file = pdf("apunte de clase.pdf");
    const uploaded = yield* teacherUpload(url, withMaterial, "Apunte", false, file);
    const material = yield* bodyOf(Material, uploaded);
    const cookie = yield* cookieFor(student);
    const downloaded = yield* download(url, material.id, cookie);

    expect(downloaded.status).toBe(200);
    expect(downloaded.bytes).toEqual(file.bytes);
    expect(downloaded.headers["content-type"]).toBe("application/pdf");
    expect(downloaded.headers["content-disposition"]).toMatch(/^attachment;/);
    expect(downloaded.headers["content-disposition"]).toContain(
      encodeURIComponent("apunte de clase.pdf"),
    );
  }),
);

test(
  "the student cannot download the material of a disabled session",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(student);
    const downloaded = yield* download(url, "01MMB100000000000000000000", cookie);

    expect(downloaded.status).toBe(404);
  }),
);

test(
  "the teacher downloads the slides of a disabled session",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const file = html("slides.html");
    const uploaded = yield* teacherUpload(url, disabled, "Slides", true, file);
    const material = yield* bodyOf(Material, uploaded);
    const cookie = yield* cookieFor(teacher);
    const downloaded = yield* download(url, material.id, cookie);

    expect(downloaded.status).toBe(200);
    expect(downloaded.bytes).toEqual(file.bytes);
  }),
);

test(
  "the teacher lists the material of a disabled session",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const materials = yield* teacherMaterials(url, disabled);

    expect(materials.map((material) => material.id)).toContain("01MMB100000000000000000000");
  }),
);

test(
  "an uploaded file comes back identical",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const file = pdf("libro.pdf", 23 * 1024 * 1024 + 17);
    const response = yield* teacherUpload(url, withMaterial, "Libro", false, file);

    expect(response.status).toBe(201);

    const material = yield* bodyOf(Material, response);

    expect(material).toMatchObject({
      sessionId: withMaterial,
      name: "Libro",
      isSlides: false,
      size: file.bytes.length,
      contentType: "application/pdf",
    });

    const cookie = yield* cookieFor(student);
    const downloaded = yield* download(url, material.id, cookie);

    expect(downloaded.bytes.length).toBe(file.bytes.length);
    expect(Buffer.from(downloaded.bytes).equals(Buffer.from(file.bytes))).toBe(true);
  }),
);

test(
  "the first slides of a session move the position to slide 1, step 1",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* teacherUpload(url, withoutSlides, "Slides", true, html("s.html"));

    expect(response.status).toBe(201);
    expect(yield* bodyOf(Material, response)).toMatchObject({ isSlides: true });
    expect(yield* position(url, withoutSlides)).toEqual([1, 1]);
  }),
);

test(
  "new slides unmark the previous ones and move the position to slide 1, step 1",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* teacherUpload(url, withSlides, "Nuevas", true, html("n.html"));
    const material = yield* bodyOf(Material, response);

    expect(response.status).toBe(201);
    expect(slidesOf(yield* teacherMaterials(url, withSlides))).toEqual([material.id]);
    expect(yield* position(url, withSlides)).toEqual([1, 1]);
  }),
);

test(
  "a file of 101 MB answers FileTooLarge and leaves no material",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const before = yield* teacherMaterials(url, withMaterial);
    const file = pdf("enorme.pdf", 101 * 1024 * 1024);
    const response = yield* teacherUpload(url, withMaterial, "Enorme", false, file);

    expect(response.status).toBe(413);
    expect(failedWith(response, FileTooLarge)).toBe(true);
    expect(yield* teacherMaterials(url, withMaterial)).toEqual(before);
  }),
);

test(
  "uploading to a deleted session answers SessionNotFound",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const response = yield* teacherUpload(url, deleted, "Apunte", false, pdf("a.pdf"));

    expect(response.status).toBe(404);
    expect(failedWith(response, SessionNotFound)).toBe(true);
  }),
);

test(
  "marking another HTML as slides unmarks the previous and moves the position to 1, 1",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);
    const other = "01MMF200000000000000000000";

    const response = yield* request(url, "PATCH", `/api/admin/materials/${other}`, {
      cookie,
      body: { isSlides: true },
    });

    expect(response.status).toBe(200);
    expect(yield* bodyOf(Material, response)).toMatchObject({ id: other, isSlides: true });
    expect(slidesOf(yield* teacherMaterials(url, twoHtml))).toEqual([other]);
    expect(yield* position(url, twoHtml)).toEqual([1, 1]);
  }),
);

test(
  "unmarking the slides leaves the session without slides at slide 1, step 1",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* request(
      url,
      "PATCH",
      "/api/admin/materials/01MMG100000000000000000000",
      {
        cookie,
        body: { isSlides: false },
      },
    );

    expect(response.status).toBe(200);
    expect(slidesOf(yield* teacherMaterials(url, slidesToUnmark))).toEqual([]);
    expect(yield* position(url, slidesToUnmark)).toEqual([1, 1]);
  }),
);

test(
  "deleting a file takes away its download",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const uploaded = yield* teacherUpload(url, withMaterial, "Para borrar", false, pdf("b.pdf"));
    const material = yield* bodyOf(Material, uploaded);
    const cookie = yield* cookieFor(teacher);

    const response = yield* request(url, "DELETE", `/api/admin/materials/${material.id}`, {
      cookie,
    });

    expect(response.status).toBe(204);
    expect((yield* download(url, material.id, cookie)).status).toBe(404);
  }),
);

test(
  "deleting the slides moves the position to slide 1, step 1",
  Effect.gen(function* () {
    const { url } = yield* stack;
    const cookie = yield* cookieFor(teacher);

    const response = yield* request(
      url,
      "DELETE",
      "/api/admin/materials/01MMH100000000000000000000",
      {
        cookie,
      },
    );

    expect(response.status).toBe(204);
    expect(yield* teacherMaterials(url, slidesToDelete)).toEqual([]);
    expect(yield* position(url, slidesToDelete)).toEqual([1, 1]);
  }),
);
