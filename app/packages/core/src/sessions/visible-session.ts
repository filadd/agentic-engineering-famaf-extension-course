import { SessionNotFound } from "@kurasu/contract/errors";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Effect from "effect/Effect";

import type { SessionsStore, StoredSession } from "./sessions-store.ts";

// What the teacher may see of a session: any session that is not deleted.
export const existingSession = (
  sessions: SessionsStore["Service"],
  id: Ulid,
): Effect.Effect<StoredSession, SessionNotFound> =>
  Effect.flatMap(sessions.get(id), (session) =>
    Effect.fromOption(session).pipe(Effect.mapError(() => new SessionNotFound())),
  );

// What the student may see of a session: it exists, is not deleted and is
// enabled. A disabled, deleted or unknown session is the same 404.
export const visibleSession = (
  sessions: SessionsStore["Service"],
  id: Ulid,
): Effect.Effect<StoredSession, SessionNotFound> =>
  Effect.filterOrFail(
    existingSession(sessions, id),
    (session) => session.enabled,
    () => new SessionNotFound(),
  );
