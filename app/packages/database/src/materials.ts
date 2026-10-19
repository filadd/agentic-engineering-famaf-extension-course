import { Material } from "@kurasu/contract/materials";
import { MaterialsStore } from "@kurasu/core/materials/materials-store";
import { and, asc, eq, ne } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";

import { batch, Database, firstRow } from "./database.ts";
import { materials, sessions } from "./schema.ts";

const decodeMaterial = Schema.decodeUnknownEffect(Material);

const toMaterial = (row: typeof materials.$inferSelect) => decodeMaterial(row).pipe(Effect.orDie);

export const D1Materials = Layer.effect(
  MaterialsStore,
  Effect.gen(function* () {
    const { db, client } = yield* Database;

    const get = (id: string) =>
      db
        .select()
        .from(materials)
        .where(eq(materials.id, id))
        .limit(1)
        .pipe(Effect.orDie, Effect.flatMap(firstRow(toMaterial)));

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
      list: (sessionId) =>
        db
          .select()
          .from(materials)
          .where(eq(materials.sessionId, sessionId))
          .orderBy(asc(materials.id))
          .pipe(Effect.orDie, Effect.flatMap(Effect.forEach(toMaterial))),
      get,
      create: (material) =>
        batch(
          client,
          material.isSlides
            ? [
                unmarkOtherSlides(material.sessionId, material.id),
                resetPosition(material.sessionId),
                db.insert(materials).values(material),
              ]
            : [db.insert(materials).values(material)],
        ).pipe(Effect.as(material)),
      setSlides: (id, isSlides) =>
        Effect.gen(function* () {
          const current = yield* get(id);

          if (Option.isNone(current) || current.value.isSlides === isSlides) {
            return current;
          }

          const material = current.value;

          yield* batch(
            client,
            isSlides
              ? [
                  unmarkOtherSlides(material.sessionId, id),
                  db.update(materials).set({ isSlides: true }).where(eq(materials.id, id)),
                  resetPosition(material.sessionId),
                ]
              : [
                  db.update(materials).set({ isSlides: false }).where(eq(materials.id, id)),
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

          yield* batch(
            client,
            material.isSlides
              ? [
                  db.delete(materials).where(eq(materials.id, id)),
                  resetPosition(material.sessionId),
                ]
              : [db.delete(materials).where(eq(materials.id, id))],
          );

          return current;
        }),
    });
  }),
);
