import { Material } from "@kurasu/contract/materials";
import { MaterialsStore } from "@kurasu/core/materials/materials-store";
import { and, eq, ne } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";

import { Database } from "./database.ts";
import { repositoryOf } from "./repository.ts";
import { materials, sessions } from "./schema.ts";

const decodeMaterial = Schema.decodeUnknownEffect(Material);

export const D1Materials = Layer.effect(
  MaterialsStore,
  Effect.gen(function* () {
    const { db } = yield* Database;

    const repository = yield* repositoryOf(materials, {
      decode: (row) => decodeMaterial(row).pipe(Effect.orDie),
    });

    const { get } = repository;

    const unmarkOtherSlides = (sessionId: string, keepId: string) =>
      db
        .update(materials)
        .set({ isSlides: false })
        .where(
          and(
            eq(materials.sessionId, sessionId),
            eq(materials.isSlides, true),
            ne(materials.id, keepId),
          ),
        );

    const resetPosition = (sessionId: string) =>
      db
        .update(sessions)
        .set({ currentSlide: 1, currentStep: 1 })
        .where(eq(sessions.id, sessionId));

    return MaterialsStore.of({
      ...repository,
      create: (material) =>
        repository
          .batch(
            material.isSlides
              ? [
                  unmarkOtherSlides(material.sessionId, material.id),
                  resetPosition(material.sessionId),
                  repository.statements.create(material),
                ]
              : [repository.statements.create(material)],
          )
          .pipe(Effect.as(material)),
      setSlides: (id, isSlides) =>
        Effect.gen(function* () {
          const current = yield* get(id);

          if (Option.isNone(current) || current.value.isSlides === isSlides) {
            return current;
          }

          const material = current.value;

          yield* repository.batch(
            isSlides
              ? [
                  unmarkOtherSlides(material.sessionId, id),
                  repository.statements.update(id, { isSlides: true }),
                  resetPosition(material.sessionId),
                ]
              : [
                  repository.statements.update(id, { isSlides: false }),
                  resetPosition(material.sessionId),
                ],
          );

          return Option.some({ ...material, isSlides });
        }),
      remove: (id) =>
        Effect.gen(function* () {
          const current = yield* get(id);

          if (Option.isNone(current)) {
            return current;
          }

          const material = current.value;
          const removal = yield* repository.statements.remove(id);

          yield* repository.batch(
            material.isSlides ? [removal, resetPosition(material.sessionId)] : [removal],
          );

          return current;
        }),
    });
  }),
);
