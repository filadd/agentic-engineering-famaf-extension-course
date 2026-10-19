import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { FileTooLarge, MaterialNotFound, SessionNotFound } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";

// The largest request body a Worker accepts on the Free and Pro plans.
export const maxFileBytes = 100 * 1024 * 1024;

export const Material = Schema.Struct({
  id: Ulid,
  sessionId: Ulid,
  name: Schema.String,
  isSlides: Schema.Boolean,
  size: Schema.Int,
  contentType: Schema.String,
});

export type Material = typeof Material.Type;

// The fields the upload form sends. The client sends them as FormData and the
// API reads them as a multipart stream, so the file goes to R2 without being
// buffered; `isSlides` travels as "true" or "false".
export const MaterialUpload = Schema.Struct({
  sessionId: Ulid,
  name: Schema.String.check(Schema.isMinLength(1)),
  isSlides: Schema.Literals(["true", "false"]),
  file: Schema.Unknown,
}).pipe(HttpApiSchema.asMultipartStream());

export class MaterialsGroup extends HttpApiGroup.make("materials")
  .add(
    HttpApiEndpoint.get("list", "/materials", {
      query: { sessionId: Ulid },
      success: Schema.Array(Material),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.get("file", "/materials/:id/file", {
      params: { id: Ulid },
      success: HttpApiSchema.StreamUint8Array(),
      error: MaterialNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}

export class AdminMaterialsGroup extends HttpApiGroup.make("adminMaterials")
  .add(
    HttpApiEndpoint.get("list", "/admin/materials", {
      query: { sessionId: Ulid },
      success: Schema.Array(Material),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.post("upload", "/admin/materials", {
      payload: MaterialUpload,
      success: Material.pipe(HttpApiSchema.status(201)),
      error: [SessionNotFound, FileTooLarge],
    }),
    HttpApiEndpoint.patch("update", "/admin/materials/:id", {
      params: { id: Ulid },
      payload: Schema.Struct({ isSlides: Schema.Boolean }),
      success: Material,
      error: MaterialNotFound,
    }),
    HttpApiEndpoint.delete("delete", "/admin/materials/:id", {
      params: { id: Ulid },
      success: HttpApiSchema.NoContent,
      error: MaterialNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}
