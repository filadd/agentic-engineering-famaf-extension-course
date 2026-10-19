import type { ClassroomTopic } from "@kurasu/contract/classroom";
import type { Ulid } from "@kurasu/contract/ulid";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";

// Tells the classroom of a session that something changed. It never fails: the
// change is already stored, so an adapter logs a classroom that does not answer
// and the write still succeeds.
export class Classroom extends Context.Service<
  Classroom,
  {
    readonly notify: (sessionId: Ulid, topic: ClassroomTopic) => Effect.Effect<void>;
  }
>()("kurasu/Classroom") {}
