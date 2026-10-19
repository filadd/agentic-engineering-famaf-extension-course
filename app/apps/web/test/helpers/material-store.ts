import type { Material } from "@kurasu/contract/materials";
import * as Schema from "effect/Schema";
import { http, HttpResponse } from "msw";

import { ulid } from "../fixtures/ids.ts";
import { apiError, noContent, readJson, url } from "./api.ts";

const textOf = (value: FormDataEntryValue | null) =>
  value instanceof File ? value.name : (value ?? "");

interface Upload {
  sessionId: string;
  name: string;
  isSlides: string;
  fileName: string;
}

// The teacher's material endpoints over an in-memory list. Marking one as
// slides unmarks the previous one, as the API does.
export const materialStore = (
  initial: ReadonlyArray<Material>,
  options: { tooLarge?: boolean } = {},
) => {
  let materials = [...initial];
  const uploads: Array<Upload> = [];
  const writes: Array<{ method: string; body: unknown }> = [];

  const markSlides = (id: string) => {
    materials = materials.map((each) => ({ ...each, isSlides: each.id === id }));
  };

  const handlers = [
    http.get(url("/admin/materials"), () => HttpResponse.json(materials)),
    http.post(url("/admin/materials"), async ({ request }) => {
      if (options.tooLarge === true) {
        return apiError("FileTooLarge");
      }

      const form = await request.formData();
      const file = form.get("file");

      const upload = {
        sessionId: textOf(form.get("sessionId")),
        name: textOf(form.get("name")),
        isSlides: textOf(form.get("isSlides")),
        fileName: file instanceof File ? file.name : "",
      };

      const created: Material = {
        id: ulid("M", 500 + materials.length),
        sessionId: upload.sessionId,
        name: upload.name,
        isSlides: false,
        size: file instanceof File ? file.size : 0,
        contentType: file instanceof File ? file.type : "",
      };

      uploads.push(upload);
      materials = [...materials, created];

      if (upload.isSlides === "true") {
        markSlides(created.id);
      }

      return HttpResponse.json(created, { status: 201 });
    }),
    http.patch(url("/admin/materials/:id"), async ({ params, request }) => {
      const body = await readJson(request, Schema.Struct({ isSlides: Schema.Boolean }));

      writes.push({ method: "PATCH", body });
      markSlides(String(params["id"]));

      return HttpResponse.json(materials.find((each) => each.id === params["id"]));
    }),
    http.delete(url("/admin/materials/:id"), ({ params }) => {
      writes.push({ method: "DELETE", body: params["id"] });
      materials = materials.filter((each) => each.id !== params["id"]);

      return noContent();
    }),
  ];

  return { handlers, uploads, writes };
};
