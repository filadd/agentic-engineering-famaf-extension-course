import { FileTooLarge } from "@kurasu/contract/errors";
import { maxFileBytes } from "@kurasu/contract/materials";
import { Files } from "@kurasu/core/materials/files";
import type * as Cloudflare from "alchemy/Cloudflare";
import { RuntimeContext } from "alchemy/RuntimeContext";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Stream from "effect/Stream";

// R2 needs the length of a streamed object up front, and a multipart part has
// none. So the file goes up in parts of a fixed size, buffering one part at a
// time; a file that fits in one part is a plain put. R2 asks every part but
// the last to be the same size, of at least 5 MiB.
const partBytes = 10 * 1024 * 1024;

const keyOf = (id: string) => `materials/${id}`;

type Bucket = Cloudflare.R2.ReadBucketClient & Cloudflare.R2.WriteBucketClient;

type MultipartUpload = Effect.Success<ReturnType<Bucket["createMultipartUpload"]>>;

type UploadedPart = Effect.Success<ReturnType<MultipartUpload["uploadPart"]>>;

export const R2Files = (bucket: Bucket) =>
  Layer.effect(
    Files,
    Effect.gen(function* () {
      const runtime = yield* RuntimeContext;

      return Files.of({
        put: (file) =>
          Effect.gen(function* () {
            const key = keyOf(file.id);

            const options = {
              httpMetadata: { contentType: file.contentType },
              customMetadata: { name: file.name },
            };

            const part = new Uint8Array(partBytes);
            const parts: Array<UploadedPart> = [];

            let filled = 0;
            let size = 0;
            let upload: MultipartUpload | undefined;

            const uploadPart = Effect.gen(function* () {
              upload ??= yield* bucket.createMultipartUpload(key, options);
              parts.push(yield* upload.uploadPart(parts.length + 1, part.slice(0, filled)));
              filled = 0;
            });

            const copy = (chunk: Uint8Array) =>
              Effect.gen(function* () {
                for (let offset = 0; offset < chunk.length;) {
                  const taken = Math.min(partBytes - filled, chunk.length - offset);

                  part.set(chunk.subarray(offset, offset + taken), filled);
                  filled += taken;
                  offset += taken;

                  if (filled === partBytes) {
                    yield* uploadPart;
                  }
                }
              });

            const write = (
              chunk: Uint8Array,
            ): Effect.Effect<void, FileTooLarge | Cloudflare.R2.R2Error, RuntimeContext> => {
              size += chunk.length;

              return size > maxFileBytes ? Effect.fail(new FileTooLarge()) : copy(chunk);
            };

            const store = Effect.gen(function* () {
              yield* Stream.runForEach(file.body, write);

              if (upload == null) {
                yield* bucket.put(key, part.slice(0, filled), options);

                return size;
              }

              if (filled > 0) {
                yield* uploadPart;
              }

              yield* upload.complete(parts);

              return size;
            });

            return yield* store.pipe(
              Effect.onError(() => (upload == null ? Effect.void : Effect.ignore(upload.abort()))),
              Effect.catchTag("R2Error", Effect.die),
            );
          }).pipe(Effect.provideService(RuntimeContext, runtime)),
        get: (id) =>
          bucket.get(keyOf(id)).pipe(
            Effect.map((object) =>
              Option.map(Option.fromNullishOr(object), (found) => ({
                name: found.customMetadata?.["name"] ?? found.key,
                contentType: found.httpMetadata?.contentType ?? "application/octet-stream",
                size: found.size,
                body: Stream.orDie(found.body),
              })),
            ),
            Effect.orDie,
            Effect.provideService(RuntimeContext, runtime),
          ),
        remove: (id) =>
          bucket
            .delete(keyOf(id))
            .pipe(Effect.orDie, Effect.provideService(RuntimeContext, runtime)),
      });
    }),
  );
