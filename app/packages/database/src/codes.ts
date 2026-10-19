import { Codes } from "@kurasu/core/access/codes";
import { and, eq, isNull } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";

import { batch, Database, now } from "./database.ts";
import { codes } from "./schema.ts";

const isCurrentEnrollment = and(eq(codes.type, "enrollment"), isNull(codes.deletedAt));

export const D1Codes = Layer.effect(
  Codes,
  Effect.gen(function* () {
    const { db, client } = yield* Database;

    const currentEnrollment = () =>
      db
        .select({ code: codes.code })
        .from(codes)
        .where(isCurrentEnrollment)
        .limit(1)
        .pipe(
          Effect.orDie,
          Effect.map((rows) => Option.fromNullishOr(rows[0]?.code)),
        );

    return Codes.of({
      currentEnrollment,
      ensureEnrollment: (candidate) =>
        Effect.gen(function* () {
          yield* db
            .insert(codes)
            .values({ id: candidate.id, type: "enrollment", code: candidate.code })
            .onConflictDoNothing()
            .pipe(Effect.orDie);

          const current = yield* currentEnrollment();

          return Option.getOrElse(current, () => candidate.code);
        }),
      regenerateEnrollment: (next) =>
        batch(client, [
          db.update(codes).set({ deletedAt: now }).where(isCurrentEnrollment),
          db.insert(codes).values({ id: next.id, type: "enrollment", code: next.code }),
        ]).pipe(Effect.as(next.code)),
      issueUserCode: (userId, code) =>
        db
          .insert(codes)
          .values({ id: code.id, type: "user", code: code.code, userId })
          .onConflictDoUpdate({ target: codes.userId, set: { id: code.id, code: code.code } })
          .pipe(Effect.orDie, Effect.asVoid),
      consumeUserCode: (code) =>
        db
          .delete(codes)
          .where(and(eq(codes.type, "user"), eq(codes.code, code)))
          .returning({ userId: codes.userId })
          .pipe(
            Effect.orDie,
            Effect.map((rows) => Option.fromNullishOr(rows[0]?.userId)),
          ),
    });
  }),
);
