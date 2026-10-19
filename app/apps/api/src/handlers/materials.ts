import { InvalidUpload } from "@kurasu/contract/errors";
import { CurrentUser } from "@kurasu/contract/middleware";
import { Ulid } from "@kurasu/contract/ulid";
import { Materials } from "@kurasu/core/materials/materials";
import * as Effect from "effect/Effect";
import * as HttpServerResponse from "effect/http/HttpServerResponse";
import * as Multipart from "effect/http/Multipart";
import { HttpApiBuilder } from "effect/http-api";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import * as Stream from "effect/Stream";

import { KurasuApi } from "@kurasu/contract/api";

import { formParts } from "../files/form-parts.ts";

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

// The upload reads the multipart body as it arrives, one part at a time: the
// form sends its fields before the file, so the session is checked and the
// file streams to R2 without being buffered whole. Fields that come after the
// file, a second file or no file at all make the form invalid.
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
          const parts = yield* formParts(payload);

          const store = Effect.gen(function* () {
            const fields = new Map<string, string>();

            let part = yield* parts.next;

            while (Option.isSome(part) && Multipart.isField(part.value)) {
              fields.set(part.value.key, part.value.value);
              part = yield* parts.next;
            }

            if (Option.isNone(part) || !Multipart.isFile(part.value)) {
              return yield* new InvalidUpload();
            }

            const file = part.value;

            const form = yield* decodeUploadFields(Object.fromEntries(fields)).pipe(
              Effect.mapError(() => new InvalidUpload()),
            );

            return yield* materials.upload({
              sessionId: form.sessionId,
              name: form.name,
              isSlides: form.isSlides === "true",
              fileName: file.name,
              contentType: file.contentType === "" ? "application/octet-stream" : file.contentType,
              body: Stream.orDie(file.content),
              formEnd: Effect.flatMap(parts.next, (rest) =>
                Option.isSome(rest) ? Effect.fail(new InvalidUpload()) : Effect.void,
              ),
            });
          });

          return yield* store.pipe(Effect.onError(() => parts.skipRest));
        }).pipe(Effect.scoped),
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
