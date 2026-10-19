import { type FileTooLarge, MaterialNotFound, type SessionNotFound } from "@kurasu/contract/errors";
import type { Material } from "@kurasu/contract/materials";
import type { Ulid } from "@kurasu/contract/ulid";
import type { User } from "@kurasu/contract/user";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import type * as Stream from "effect/Stream";

import { Classroom } from "../classroom.ts";
import { SessionsStore } from "../sessions/sessions-store.ts";
import { existingSession, visibleSession } from "../sessions/visible-session.ts";
import { Files, type StoredFile } from "./files.ts";
import { MaterialsStore } from "./materials-store.ts";

export interface MaterialUpload {
  readonly sessionId: Ulid;
  readonly name: string;
  readonly isSlides: boolean;
  readonly fileName: string;
  readonly contentType: string;
  readonly body: Stream.Stream<Uint8Array, FileTooLarge>;
}

// The material of the sessions. The student lists and downloads the material
// of enabled sessions; the teacher, of any session not deleted. Whenever the
// slides of a session change (an upload marked as slides, marking or unmarking
// one, or deleting the slides) the store moves the teacher's position back to
// slide 1, step 1, so the classroom hears `slide` as well as `material`.
export class Materials extends Context.Service<
  Materials,
  {
    readonly list: (
      viewer: User,
      sessionId: Ulid,
    ) => Effect.Effect<ReadonlyArray<Material>, SessionNotFound>;
    readonly file: (viewer: User, id: Ulid) => Effect.Effect<StoredFile, MaterialNotFound>;
    readonly upload: (
      upload: MaterialUpload,
    ) => Effect.Effect<Material, SessionNotFound | FileTooLarge>;
    readonly setSlides: (id: Ulid, isSlides: boolean) => Effect.Effect<Material, MaterialNotFound>;
    readonly remove: (id: Ulid) => Effect.Effect<void, MaterialNotFound>;
  }
>()("kurasu/Materials") {
  static readonly layer = Layer.effect(
    Materials,
    Effect.gen(function* () {
      const store = yield* MaterialsStore;
      const files = yield* Files;
      const sessions = yield* SessionsStore;
      const classroom = yield* Classroom;
      const crypto = yield* Crypto.Crypto;

      const sessionFor = (viewer: User, sessionId: Ulid) =>
        Effect.provideService(
          viewer.role === "teacher" ? existingSession(sessionId) : visibleSession(sessionId),
          SessionsStore,
          sessions,
        );

      const findMaterial = (id: Ulid) =>
        Effect.flatMap(store.get(id), (material) =>
          Effect.fromOption(material).pipe(Effect.mapError(() => new MaterialNotFound())),
        );

      const notifyChange = (sessionId: Ulid, slidesChanged: boolean) =>
        Effect.gen(function* () {
          yield* classroom.notify(sessionId, "material");

          if (slidesChanged) {
            yield* classroom.notify(sessionId, "slide");
          }
        });

      return Materials.of({
        list: Effect.fn("Materials.list")(function* (viewer, sessionId) {
          yield* sessionFor(viewer, sessionId);

          return yield* store.list(sessionId);
        }),
        file: Effect.fn("Materials.file")(function* (viewer, id) {
          const material = yield* findMaterial(id);

          yield* sessionFor(viewer, material.sessionId).pipe(
            Effect.mapError(() => new MaterialNotFound()),
          );

          return yield* Effect.flatMap(files.get(id), (file) =>
            Effect.fromOption(file).pipe(Effect.mapError(() => new MaterialNotFound())),
          );
        }),
        upload: Effect.fn("Materials.upload")(function* (upload) {
          yield* Effect.provideService(existingSession(upload.sessionId), SessionsStore, sessions);

          const id = yield* crypto.randomULID.pipe(Effect.orDie);

          const size = yield* files.put({
            id,
            name: upload.fileName,
            contentType: upload.contentType,
            body: upload.body,
          });

          const material = yield* store.create({
            id,
            sessionId: upload.sessionId,
            name: upload.name,
            isSlides: upload.isSlides,
            size,
            contentType: upload.contentType,
          });

          yield* notifyChange(upload.sessionId, upload.isSlides);

          return material;
        }),
        setSlides: Effect.fn("Materials.setSlides")(function* (id, isSlides) {
          const current = yield* findMaterial(id);

          const updated = yield* Effect.flatMap(store.setSlides(id, isSlides), (material) =>
            Effect.fromOption(material).pipe(Effect.mapError(() => new MaterialNotFound())),
          );

          if (current.isSlides !== isSlides) {
            yield* notifyChange(current.sessionId, true);
          }

          return updated;
        }),
        remove: Effect.fn("Materials.remove")(function* (id) {
          const removed = yield* Effect.flatMap(store.remove(id), (material) =>
            Effect.fromOption(material).pipe(Effect.mapError(() => new MaterialNotFound())),
          );

          yield* files.remove(id);
          yield* notifyChange(removed.sessionId, removed.isSlides);
        }),
      });
    }),
  );
}
