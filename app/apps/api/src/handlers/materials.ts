import type { Material } from "@kurasu/contract/materials";
import { CurrentUser } from "@kurasu/contract/middleware";
import { Ulid } from "@kurasu/contract/ulid";
import { Materials } from "@kurasu/core/materials/materials";
import * as Effect from "effect/Effect";
import * as HttpServerResponse from "effect/http/HttpServerResponse";
import * as Multipart from "effect/http/Multipart";
import { HttpApiBuilder } from "effect/http-api";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";

import { KurasuApi } from "@kurasu/contract/api";

const decodeUploadFields = Schema.decodeUnknownEffect(
  Schema.Struct({
    sessionId: Ulid,
    name: Schema.String.check(Schema.isMinLength(1)),
    isSlides: Schema.Literals(["true", "false"]),
  }),
);

const contentDisposition = (name: string) =>
  `attachment; filename*=UTF-8''${encodeURIComponent(name)}`;

export const MaterialsHandlers = HttpApiBuilder.group(KurasuApi, "materials", (handlers) =>
  handlers
    .handle("list", ({ query }) =>
      Effect.gen(function* () {
        const materials = yield* Materials;

        return yield* materials.list(yield* CurrentUser, query.sessionId);
      }),
    )
    .handle("file", ({ params }) =>
      Effect.gen(function* () {
        const materials = yield* Materials;
        const file = yield* materials.file(yield* CurrentUser, params.id);

        return HttpServerResponse.stream(file.body, {
          contentType: file.contentType,
          contentLength: file.size,
          headers: { "content-disposition": contentDisposition(file.name) },
        });
      }),
    ),
);

// The upload reads the multipart body as it arrives: the form sends its fields
// before the file, so the session is checked and the file streams to R2
// without being buffered whole.
export const AdminMaterialsHandlers = HttpApiBuilder.group(
  KurasuApi,
  "adminMaterials",
  (handlers) =>
    handlers
      .handle("list", ({ query }) =>
        Effect.gen(function* () {
          const materials = yield* Materials;

          return yield* materials.list(yield* CurrentUser, query.sessionId);
        }),
      )
      .handle("upload", ({ payload }) =>
        Effect.gen(function* () {
          const materials = yield* Materials;
          const fields = new Map<string, string>();
          const uploaded: Array<Material> = [];

          yield* Stream.runForEach(payload, (part) =>
            Multipart.isField(part)
              ? Effect.sync(() => fields.set(part.key, part.value))
              : Effect.gen(function* () {
                  const form = yield* decodeUploadFields(Object.fromEntries(fields)).pipe(
                    Effect.orDie,
                  );

                  uploaded.push(
                    yield* materials.upload({
                      sessionId: form.sessionId,
                      name: form.name,
                      isSlides: form.isSlides === "true",
                      fileName: part.name,
                      contentType:
                        part.contentType === "" ? "application/octet-stream" : part.contentType,
                      body: Stream.orDie(part.content),
                    }),
                  );
                }),
          ).pipe(Effect.catchTag("MultipartError", Effect.die));

          return uploaded[0] ?? (yield* Effect.die("the upload carried no file"));
        }),
      )
      .handle("update", ({ params, payload }) =>
        Effect.gen(function* () {
          const materials = yield* Materials;

          return yield* materials.setSlides(params.id, payload.isSlides);
        }),
      )
      .handle("delete", ({ params }) =>
        Effect.gen(function* () {
          const materials = yield* Materials;

          yield* materials.remove(params.id);
        }),
      ),
);
