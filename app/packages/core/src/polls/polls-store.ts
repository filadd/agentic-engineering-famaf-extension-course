import type { AdminPoll, PollChange, PollStatus } from "@kurasu/contract/polls";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";

export type StoredPoll = Omit<AdminPoll, "results">;

export interface PollFilter {
  readonly sessionIds: ReadonlyArray<Ulid>;
  readonly statuses: ReadonlyArray<PollStatus>;
}

// Polls stored in D1, in creation order. Every read leaves out deleted polls;
// `markDeleted` keeps the row and its responses.
export class PollsStore extends Context.Service<
  PollsStore,
  {
    readonly list: (filter: PollFilter) => Effect.Effect<ReadonlyArray<StoredPoll>>;
    readonly get: (id: Ulid) => Effect.Effect<Option.Option<StoredPoll>>;
    readonly create: (poll: StoredPoll) => Effect.Effect<StoredPoll>;
    readonly update: (id: Ulid, change: PollChange) => Effect.Effect<Option.Option<StoredPoll>>;
    readonly markDeleted: (id: Ulid) => Effect.Effect<void>;
  }
>()("kurasu/PollsStore") {}
