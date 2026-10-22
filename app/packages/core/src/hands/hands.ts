import { NotStudent, type SessionNotFound } from "@kurasu/contract/errors";
import type { RaisedHand, RaisedHandSummary } from "@kurasu/contract/raised-hands";
import type { Ulid } from "@kurasu/contract/ulid";
import type { User } from "@kurasu/contract/user";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { Classroom } from "../classroom.ts";
import { SessionsStore } from "../sessions/sessions-store.ts";
import { existingSession, visibleSession } from "../sessions/visible-session.ts";
import { HandsStore } from "./hands-store.ts";

// The raised hands of the sessions. A student raises and lowers their own in
// an enabled session; the teacher sees every hand with its name and avatar and
// lowers anyone's.
export class Hands extends Context.Service<
  Hands,
  {
    readonly listForStudent: (
      sessionId: Ulid,
    ) => Effect.Effect<ReadonlyArray<RaisedHandSummary>, SessionNotFound>;
    readonly raise: (
      viewer: User,
      sessionId: Ulid,
    ) => Effect.Effect<RaisedHand, SessionNotFound | NotStudent>;
    readonly lowerOwn: (viewer: User, sessionId: Ulid) => Effect.Effect<void, SessionNotFound>;
    readonly listForTeacher: (
      sessionId: Ulid,
    ) => Effect.Effect<ReadonlyArray<RaisedHand>, SessionNotFound>;
    readonly lower: (sessionId: Ulid, userId: Ulid) => Effect.Effect<void, SessionNotFound>;
  }
>()("kurasu/Hands") {
  static readonly layer = Layer.effect(
    Hands,
    Effect.gen(function* () {
      const store = yield* HandsStore;
      const sessions = yield* SessionsStore;
      const classroom = yield* Classroom;
      const crypto = yield* Crypto.Crypto;

      const lower = (sessionId: Ulid, userId: Ulid) =>
        Effect.gen(function* () {
          yield* store.lower(sessionId, userId);
          yield* classroom.notify(sessionId, "hands");
        });

      return Hands.of({
        listForStudent: Effect.fn("Hands.listForStudent")(function* (sessionId) {
          yield* visibleSession(sessions, sessionId);

          const hands = yield* store.list(sessionId);

          return hands.map((hand) => ({ sessionId: hand.sessionId, userId: hand.user.id }));
        }),
        raise: Effect.fn("Hands.raise")(function* (viewer, sessionId) {
          if (viewer.role !== "student") {
            return yield* new NotStudent();
          }

          yield* visibleSession(sessions, sessionId);

          const id = yield* crypto.randomULID.pipe(Effect.orDie);
          const hand = yield* store.raise({ id, sessionId, userId: viewer.id });

          yield* classroom.notify(sessionId, "hands");

          return hand;
        }),
        lowerOwn: Effect.fn("Hands.lowerOwn")(function* (viewer, sessionId) {
          yield* visibleSession(sessions, sessionId);
          yield* lower(sessionId, viewer.id);
        }),
        listForTeacher: Effect.fn("Hands.listForTeacher")(function* (sessionId) {
          yield* existingSession(sessions, sessionId);

          return yield* store.list(sessionId);
        }),
        lower: Effect.fn("Hands.lower")(function* (sessionId, userId) {
          yield* existingSession(sessions, sessionId);
          yield* lower(sessionId, userId);
        }),
      });
    }),
  );
}
