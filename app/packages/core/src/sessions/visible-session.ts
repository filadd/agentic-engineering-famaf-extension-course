import { SessionNotFound } from "@kurasu/contract/errors";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Effect from "effect/Effect";
import * as Option from "effect/Option";

import { SessionsStore, type StoredSession } from "./sessions-store.ts";

// What the student may see of a session: it exists, is not deleted and is
// enabled. A disabled, deleted or unknown session is the same 404.
export const visibleSession = (
  id: Ulid,
): Effect.Effect<StoredSession, SessionNotFound, SessionsStore> =>
  Effect.gen(function* () {
    const sessions = yield* SessionsStore;
    const session = Option.filter(yield* sessions.get(id), (found) => found.enabled);

    return yield* Effect.fromOption(session).pipe(Effect.mapError(() => new SessionNotFound()));
  });

// What the teacher may see of a session: any session that is not deleted.
export const existingSession = (
  id: Ulid,
): Effect.Effect<StoredSession, SessionNotFound, SessionsStore> =>
  Effect.gen(function* () {
    const sessions = yield* SessionsStore;

    return yield* Effect.fromOption(yield* sessions.get(id)).pipe(
      Effect.mapError(() => new SessionNotFound()),
    );
  });
