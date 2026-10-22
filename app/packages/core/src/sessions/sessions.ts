import type { ClassroomTopic } from "@kurasu/contract/classroom";
import { OrderMismatch, SessionEnabled, SessionNotFound } from "@kurasu/contract/errors";
import type {
  Session,
  SessionChange,
  SessionInput,
  SessionSummary,
} from "@kurasu/contract/sessions";
import type { Ulid } from "@kurasu/contract/ulid";
import type { User } from "@kurasu/contract/user";
import * as Context from "effect/Context";
import * as Crypto from "effect/Crypto";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Option from "effect/Option";

import { Changelog } from "../changelog/changelog.ts";
import { Classroom } from "../classroom.ts";
import { SessionsStore, type StoredSession } from "./sessions-store.ts";
import { existingSession, visibleSession } from "./visible-session.ts";

const toSummary = (session: StoredSession): SessionSummary => ({
  id: session.id,
  title: session.title,
  summary: session.summary,
  position: session.position,
  enabled: session.enabled,
});

const toStudentSession = (session: StoredSession): Session => ({
  id: session.id,
  title: session.title,
  summary: session.summary,
  position: session.position,
  currentSlide: session.currentSlide,
  currentStep: session.currentStep,
});

// The topics a change to a session tells the classroom about: the teacher's
// position is `slide`; the rest of the session, enabling it included, is
// `session`.
const changedTopics = (change: SessionChange): ReadonlyArray<ClassroomTopic> => {
  const moved = change.currentSlide != null || change.currentStep != null;
  const edited = change.title != null || change.summary != null || change.enabled != null;

  return [...(edited ? ["session" as const] : []), ...(moved ? ["slide" as const] : [])];
};

// The sessions as each side sees them. The student sees only enabled sessions,
// without `enabled`; the featured one is the last of them. The teacher sees
// every session not deleted. A session is deleted only while disabled, and a
// reorder lists every session not deleted. A student enters only the classroom
// of the featured session; the teacher, that of any session not deleted.
export class Sessions extends Context.Service<
  Sessions,
  {
    readonly listVisible: () => Effect.Effect<ReadonlyArray<SessionSummary>>;
    readonly getVisible: (id: Ulid) => Effect.Effect<Session, SessionNotFound>;
    readonly featured: () => Effect.Effect<Option.Option<SessionSummary>>;
    readonly classroomOf: (viewer: User, id: Ulid) => Effect.Effect<void, SessionNotFound>;
    readonly listAll: () => Effect.Effect<ReadonlyArray<SessionSummary>>;
    readonly get: (id: Ulid) => Effect.Effect<Session, SessionNotFound>;
    readonly create: (input: SessionInput) => Effect.Effect<Session>;
    readonly update: (id: Ulid, change: SessionChange) => Effect.Effect<Session, SessionNotFound>;
    readonly remove: (id: Ulid) => Effect.Effect<void, SessionNotFound | SessionEnabled>;
    readonly reorder: (ids: ReadonlyArray<Ulid>) => Effect.Effect<void, OrderMismatch>;
  }
>()("kurasu/Sessions") {
  static readonly layer = Layer.effect(
    Sessions,
    Effect.gen(function* () {
      const store = yield* SessionsStore;
      const classroom = yield* Classroom;
      const changelog = yield* Changelog;
      const crypto = yield* Crypto.Crypto;

      const listVisible = () => store.listEnabled();

      const listAll = () => store.list({ orderBy: { field: "position", direction: "asc" } });

      const featured = () =>
        Effect.map(listVisible(), (sessions) => Option.fromNullishOr(sessions.at(-1)));

      return Sessions.of({
        listVisible,
        getVisible: (id) => visibleSession(store, id).pipe(Effect.map(toStudentSession)),
        featured,
        classroomOf: Effect.fn("Sessions.classroomOf")(function* (viewer, id) {
          if (viewer.role === "teacher") {
            return yield* existingSession(store, id).pipe(Effect.asVoid);
          }

          const session = Option.filter(yield* featured(), (found) => found.id === id);

          return yield* Effect.fromOption(session).pipe(
            Effect.mapError(() => new SessionNotFound()),
            Effect.asVoid,
          );
        }),
        listAll: () => Effect.map(listAll(), (sessions) => sessions.map(toSummary)),
        get: (id) => existingSession(store, id),
        create: Effect.fn("Sessions.create")(function* (input) {
          const id = yield* crypto.randomULID.pipe(Effect.orDie);

          return yield* store.create({ id, ...input });
        }),
        update: Effect.fn("Sessions.update")(function* (id, change) {
          const previous = yield* existingSession(store, id);

          const session = yield* Effect.fromOption(yield* store.update(id, change)).pipe(
            Effect.mapError(() => new SessionNotFound()),
          );

          yield* Effect.forEach(changedTopics(change), (topic) => classroom.notify(id, topic), {
            discard: true,
          });

          if (!previous.enabled && session.enabled) {
            yield* changelog.record({
              sessionId: id,
              type: "session-enabled",
              entityId: id,
              name: session.title,
            });
          }

          if (previous.enabled && !session.enabled) {
            yield* changelog.drop({ type: "session-enabled", entityId: id });
          }

          return session;
        }),
        remove: Effect.fn("Sessions.remove")(function* (id) {
          const session = yield* existingSession(store, id);

          if (session.enabled) {
            return yield* new SessionEnabled();
          }

          yield* store.remove(id);

          return yield* classroom.notify(id, "session");
        }),
        reorder: Effect.fn("Sessions.reorder")(function* (ids) {
          const current = new Set((yield* listAll()).map((session) => session.id));
          const requested = new Set(ids);

          const matches =
            ids.length === current.size &&
            requested.size === ids.length &&
            ids.every((id) => current.has(id));

          if (!matches) {
            return yield* new OrderMismatch();
          }

          return yield* store.reorder(ids);
        }),
      });
    }),
  );
}
