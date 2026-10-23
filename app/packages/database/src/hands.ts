import { RaisedHand } from "@kurasu/contract/raised-hands";
import { Ulid } from "@kurasu/contract/ulid";
import { HandsStore } from "@kurasu/core/hands/hands-store";
import { asc, eq } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { Database } from "./database.ts";
import { repositoryOf } from "./repository.ts";
import { raisedHands, users } from "./schema.ts";

const decodeStoredHand = Schema.decodeUnknownEffect(
  Schema.Struct({ id: Ulid, sessionId: Ulid, userId: Ulid }),
);

const decodeHand = Schema.decodeUnknownEffect(RaisedHand);

interface HandRow {
  readonly sessionId: string;
  readonly userId: string;
  readonly name: string | null;
  readonly avatar: string | null;
}

const toHand = (row: HandRow) =>
  decodeHand({
    sessionId: row.sessionId,
    user: { id: row.userId, name: row.name, avatar: row.avatar },
  }).pipe(Effect.orDie);

export const D1Hands = Layer.effect(
  HandsStore,
  Effect.gen(function* () {
    const { db } = yield* Database;

    const repository = yield* repositoryOf(raisedHands, {
      decode: (row) => decodeStoredHand(row).pipe(Effect.orDie),
    });

    return HandsStore.of({
      upsert: repository.upsert,
      removeWhere: repository.removeWhere,
      raisedIn: (sessionId) =>
        db
          .select({
            sessionId: raisedHands.sessionId,
            userId: raisedHands.userId,
            name: users.name,
            avatar: users.avatar,
          })
          .from(raisedHands)
          .innerJoin(users, eq(users.id, raisedHands.userId))
          .where(eq(raisedHands.sessionId, sessionId))
          .orderBy(asc(users.name))
          .pipe(Effect.orDie, Effect.flatMap(Effect.forEach(toHand))),
    });
  }),
);
