import type { RaisedHand } from "@kurasu/contract/raised-hands";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

import type { Repository } from "../repository.ts";

export interface StoredHand {
  readonly id: Ulid;
  readonly sessionId: Ulid;
  readonly userId: Ulid;
}

export type NewHand = StoredHand;

// Raised hands stored in D1, one per student and session. `raisedIn` reads the
// hands of a session with the name and avatar of each student, by name, in one
// query.
export class HandsStore extends Context.Service<
  HandsStore,
  Pick<Repository<StoredHand, NewHand, never>, "list" | "upsert" | "removeWhere"> & {
    readonly raisedIn: (sessionId: Ulid) => Effect.Effect<ReadonlyArray<RaisedHand>>;
  }
>()("kurasu/HandsStore") {}
