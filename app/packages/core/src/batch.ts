import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

// A write that has not run yet. The core only passes it to `Batch.run`; the
// adapter that builds it is the one that knows how to run it.
export interface Write {
  readonly toSQL: () => { readonly sql: string; readonly params: ReadonlyArray<unknown> };
}

// Runs writes of several stores as one atomic batch, in order. A failure is a
// defect and none of the writes applies.
export class Batch extends Context.Service<
  Batch,
  { readonly run: (writes: ReadonlyArray<Write>) => Effect.Effect<void> }
>()("kurasu/Batch") {}
