import { Ulid } from "@kurasu/contract/ulid";
import { Codes } from "@kurasu/core/access/codes";
import * as DateTime from "effect/DateTime";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";
import * as Schema from "effect/Schema";

import { Database } from "./database.ts";
import { repositoryOf } from "./repository.ts";
import { codes } from "./schema.ts";

const decodeCode = Schema.decodeUnknownEffect(
  Schema.Struct({
    id: Ulid,
    type: Schema.Literals(["user", "enrollment"]),
    code: Schema.String,
    userId: Schema.NullOr(Ulid),
    deletedAt: Schema.NullOr(Schema.DateTimeUtcFromDate),
  }),
);

const currentEnrollment = { type: "enrollment", deletedAt: null } as const;

export const D1Codes = Layer.effect(
  Codes,
  Effect.gen(function* () {
    const { db } = yield* Database;

    const repository = yield* repositoryOf(codes, {
      decode: (row) => decodeCode(row).pipe(Effect.orDie),
    });

    const current = Effect.map(
      repository.find(currentEnrollment),
      Option.map((code) => code.code),
    );

    return Codes.of({
      currentEnrollment: () => current,
      // The current enrollment code is unique through a partial index, which an
      // upsert cannot name as its conflict target.
      ensureEnrollment: (candidate) =>
        Effect.gen(function* () {
          yield* db
            .insert(codes)
            .values({ id: candidate.id, type: "enrollment", code: candidate.code })
            .onConflictDoNothing()
            .pipe(Effect.orDie);

          return Option.getOrElse(yield* current, () => candidate.code);
        }),
      regenerateEnrollment: (next) =>
        Effect.gen(function* () {
          const deletedAt = DateTime.toDateUtc(yield* DateTime.now);

          yield* repository.batch([
            yield* repository.statements.updateWhere(currentEnrollment, { deletedAt }),
            repository.statements.create({ id: next.id, type: "enrollment", code: next.code }),
          ]);

          return next.code;
        }),
      issueUserCode: (userId, code) =>
        repository.upsert(
          { id: code.id, type: "user", code: code.code, userId },
          { target: ["userId"], set: { id: code.id, code: code.code } },
        ),
      consumeUserCode: (code) =>
        Effect.map(repository.removeWhere({ type: "user", code }, { returning: true }), (removed) =>
          Option.fromNullishOr(removed[0]?.userId),
        ),
    });
  }),
);
