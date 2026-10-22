import type { ResponseValue } from "@kurasu/contract/polls";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

export interface NewResponse {
  readonly id: Ulid;
  readonly pollId: Ulid;
  readonly userId: Ulid;
  readonly value: ResponseValue;
}

// One response per student and poll. `upsert` replaces the previous vote and
// keeps its id; `forUser` returns the student's votes and `values` every vote
// of each poll, both keyed by poll id, so the results never say who voted
// what.
export class ResponsesStore extends Context.Service<
  ResponsesStore,
  {
    readonly upsert: (response: NewResponse) => Effect.Effect<void>;
    readonly forUser: (
      userId: Ulid,
      pollIds: ReadonlyArray<Ulid>,
    ) => Effect.Effect<ReadonlyMap<Ulid, ResponseValue>>;
    readonly values: (
      pollIds: ReadonlyArray<Ulid>,
    ) => Effect.Effect<ReadonlyMap<Ulid, ReadonlyArray<ResponseValue>>>;
  }
>()("kurasu/ResponsesStore") {}
