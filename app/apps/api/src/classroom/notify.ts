import type { ClassroomTopic } from "@kurasu/contract/classroom";
import { Classroom } from "@kurasu/core/classroom";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

interface AulaStub {
  readonly notify: (topic: ClassroomTopic) => Effect.Effect<void>;
}

interface Aulas {
  readonly getByName: (name: string) => AulaStub;
}

// Tells the classroom of the session, a Durable Object named after it, over
// RPC. The change is already stored, so a classroom that does not answer is
// logged and the write still succeeds; the RPC failure is not in the stub's
// type, so the whole cause is caught.
export const DurableObjectClassroom = (aulas: Aulas) =>
  Layer.succeed(
    Classroom,
    Classroom.of({
      notify: (sessionId, topic) =>
        Effect.suspend(() => aulas.getByName(sessionId).notify(topic)).pipe(
          Effect.catchCause((cause) =>
            Effect.logWarning("the classroom did not hear a change", { sessionId, topic, cause }),
          ),
        ),
    }),
  );
