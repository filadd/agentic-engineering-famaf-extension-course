import type {
  Session,
  SessionChange,
  SessionInput,
  SessionSummary,
} from "@kurasu/contract/sessions";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

import type { Repository } from "../repository.ts";

export interface StoredSession extends Session {
  readonly enabled: boolean;
}

export interface NewSession extends SessionInput {
  readonly id: Ulid;
}

// Sessions stored in D1. Every read leaves out deleted sessions, and `remove`
// marks the session as deleted. `listEnabled` is the student's list, ordered
// by position and without `enabled`; `create` appends the session at the end,
// disabled and on slide 1, step 1; `reorder` receives every session not
// deleted, in the new order.
export class SessionsStore extends Context.Service<
  SessionsStore,
  Pick<
    Repository<StoredSession, NewSession, SessionChange>,
    "get" | "list" | "create" | "update" | "remove"
  > & {
    readonly listEnabled: () => Effect.Effect<ReadonlyArray<SessionSummary>>;
    readonly reorder: (ids: ReadonlyArray<Ulid>) => Effect.Effect<void>;
  }
>()("kurasu/SessionsStore") {}
