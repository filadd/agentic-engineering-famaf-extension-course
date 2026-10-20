import type {
  Session,
  SessionChange,
  SessionInput,
  SessionSummary,
} from "@kurasu/contract/sessions";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";

export interface StoredSession extends Session {
  readonly enabled: boolean;
}

export interface NewSession extends SessionInput {
  readonly id: Ulid;
}

// Sessions stored in D1, ordered by position. Every read leaves out deleted
// sessions. `listEnabled` is the student's list, without `enabled`; `create`
// appends the session at the end, disabled and on slide 1, step 1; `reorder`
// receives every session not deleted, in the new order.
export class SessionsStore extends Context.Service<
  SessionsStore,
  {
    readonly listEnabled: () => Effect.Effect<ReadonlyArray<SessionSummary>>;
    readonly listAll: () => Effect.Effect<ReadonlyArray<StoredSession>>;
    readonly get: (id: Ulid) => Effect.Effect<Option.Option<StoredSession>>;
    readonly create: (session: NewSession) => Effect.Effect<StoredSession>;
    readonly update: (
      id: Ulid,
      change: SessionChange,
    ) => Effect.Effect<Option.Option<StoredSession>>;
    readonly markDeleted: (id: Ulid) => Effect.Effect<void>;
    readonly reorder: (ids: ReadonlyArray<Ulid>) => Effect.Effect<void>;
  }
>()("kurasu/SessionsStore") {}
