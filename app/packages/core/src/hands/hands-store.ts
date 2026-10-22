import type { RaisedHand } from "@kurasu/contract/raised-hands";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

export interface NewHand {
  readonly id: Ulid;
  readonly sessionId: Ulid;
  readonly userId: Ulid;
}

// Raised hands stored in D1, one per student and session. Raising a raised
// hand leaves the one hand there.
export class HandsStore extends Context.Service<
  HandsStore,
  {
    readonly list: (sessionId: Ulid) => Effect.Effect<ReadonlyArray<RaisedHand>>;
    readonly raise: (hand: NewHand) => Effect.Effect<RaisedHand>;
    readonly lower: (sessionId: Ulid, userId: Ulid) => Effect.Effect<void>;
  }
>()("kurasu/HandsStore") {}
