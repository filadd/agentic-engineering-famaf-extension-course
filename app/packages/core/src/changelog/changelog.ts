import { maxChangelogEntries, type ChangelogEntry } from "@kurasu/contract/changelog";
import { ChangelogEntryNotFound, type SessionNotFound } from "@kurasu/contract/errors";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { SessionsStore } from "../sessions/sessions-store.ts";
import { existingSession } from "../sessions/visible-session.ts";
import { ChangelogStore, type NewChangelogEntry } from "./changelog-store.ts";

const logFailure = (action: string) =>
  Effect.catchCause((cause) => Effect.logError(`the changelog entry was not ${action}`, cause));

export type ChangelogRecord = Omit<NewChangelogEntry, "id">;

export type ChangelogEntity = Pick<ChangelogEntry, "type" | "entityId">;

// The pending changelog entries of the sessions. A change records or drops its
// entry after it is stored, not in the same write: `record` and `drop` never
// fail, and a failure is logged and leaves the change without its entry.
// Recording an entry that exists leaves it as it was; dropping one that does
// not exist does nothing.
export class Changelog extends Context.Service<
  Changelog,
  {
    readonly record: (entry: ChangelogRecord) => Effect.Effect<void>;
    readonly drop: (entity: ChangelogEntity) => Effect.Effect<void>;
    readonly list: (
      sessionId: Ulid,
    ) => Effect.Effect<ReadonlyArray<ChangelogEntry>, SessionNotFound>;
    readonly discard: (id: Ulid) => Effect.Effect<void, ChangelogEntryNotFound>;
  }
>()("kurasu/Changelog") {
  static readonly layer = Layer.effect(
    Changelog,
    Effect.gen(function* () {
      const store = yield* ChangelogStore;
      const sessions = yield* SessionsStore;
      const crypto = yield* Crypto.Crypto;

      return Changelog.of({
        record: (entry) =>
          Effect.gen(function* () {
            const id = yield* crypto.randomULID.pipe(Effect.orDie);

            yield* store.upsert({ id, ...entry }, { target: ["type", "entityId"] });
          }).pipe(logFailure("recorded")),
        drop: ({ type, entityId }) =>
          store.removeWhere({ type, entityId }).pipe(Effect.asVoid, logFailure("dropped")),
        // The newest entries, shown from the oldest to the newest.
        list: Effect.fn("Changelog.list")(function* (sessionId) {
          const [, newest] = yield* Effect.all(
            [
              existingSession(sessions, sessionId),
              store.list({
                where: { sessionId },
                orderBy: { field: "createdAt", direction: "desc" },
                limit: maxChangelogEntries,
              }),
            ],
            { concurrency: "unbounded" },
          );

          return newest.toReversed();
        }),
        discard: Effect.fn("Changelog.discard")(function* (id) {
          const removed = yield* store.remove(id, { returning: true });

          return yield* Effect.fromOption(removed).pipe(
            Effect.mapError(() => new ChangelogEntryNotFound()),
            Effect.asVoid,
          );
        }),
      });
    }),
  );
}
