import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

export const WriteTypeId: unique symbol = Symbol("kurasu/Write");

// A write that has not run yet. The core cannot look inside it and only passes
// it to `Batch.run`; the adapter that builds it is the one that knows how to
// run it.
export interface Write {
  readonly [WriteTypeId]: typeof WriteTypeId;
}

// Runs writes of several stores as one atomic batch, in order. A failure is a
// defect and none of the writes applies.
export class Batch extends Context.Service<
  Batch,
  { readonly run: (writes: ReadonlyArray<Write>) => Effect.Effect<void> }
>()("kurasu/Batch") {}
