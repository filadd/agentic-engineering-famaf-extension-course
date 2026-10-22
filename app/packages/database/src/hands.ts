import { RaisedHand } from "@kurasu/contract/raised-hands";
import { HandsStore } from "@kurasu/core/hands/hands-store";
import { and, asc, eq } from "drizzle-orm";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { Database } from "./database.ts";
import { raisedHands, users } from "./schema.ts";

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

    const select = () =>
      db
        .select({
          sessionId: raisedHands.sessionId,
          userId: raisedHands.userId,
          name: users.name,
          avatar: users.avatar,
        })
        .from(raisedHands)
        .innerJoin(users, eq(users.id, raisedHands.userId));

    return HandsStore.of({
      list: (sessionId) =>
        select()
          .where(eq(raisedHands.sessionId, sessionId))
          .orderBy(asc(users.name))
          .pipe(Effect.orDie, Effect.flatMap(Effect.forEach(toHand))),
      raise: ({ id, sessionId, userId }) =>
        Effect.gen(function* () {
          yield* db
            .insert(raisedHands)
            .values({ id, sessionId, userId })
            .onConflictDoNothing()
            .pipe(Effect.orDie);

          const rows = yield* select()
            .where(and(eq(raisedHands.sessionId, sessionId), eq(raisedHands.userId, userId)))
            .limit(1)
            .pipe(Effect.orDie);

          const row = rows[0];

          return row == null
            ? yield* Effect.die("the raised hand was not stored")
            : yield* toHand(row);
        }),
      lower: (sessionId, userId) =>
        db
          .delete(raisedHands)
          .where(and(eq(raisedHands.sessionId, sessionId), eq(raisedHands.userId, userId)))
          .pipe(Effect.orDie, Effect.asVoid),
    });
  }),
);
