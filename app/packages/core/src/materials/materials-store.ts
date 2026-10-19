import type { Material } from "@kurasu/contract/materials";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import type * as Option from "effect/Option";

// Materials stored in D1. A session has at most one material marked as slides,
// and its stored position always belongs to the current slides. So whenever
// the slides change (`create` with isSlides, `setSlides`, or `remove` of the
// slides), the same batch unmarks the previous slides and moves the session's
// position back to slide 1, step 1.
export class MaterialsStore extends Context.Service<
  MaterialsStore,
  {
    readonly list: (sessionId: Ulid) => Effect.Effect<ReadonlyArray<Material>>;
    readonly get: (id: Ulid) => Effect.Effect<Option.Option<Material>>;
    readonly create: (material: Material) => Effect.Effect<Material>;
    readonly setSlides: (id: Ulid, isSlides: boolean) => Effect.Effect<Option.Option<Material>>;
    readonly remove: (id: Ulid) => Effect.Effect<Option.Option<Material>>;
  }
>()("kurasu/MaterialsStore") {}
