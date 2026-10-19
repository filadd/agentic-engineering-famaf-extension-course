import type { ClassroomTopic } from "@kurasu/contract/classroom";
import * as Cloudflare from "alchemy/Cloudflare";
import * as Effect from "effect/Effect";
import * as HttpServerResponse from "effect/http/HttpServerResponse";

// The classroom of one session. It does not accept sockets nor send notices
// yet: it only exists so the Worker can bind it.
export default class Aula extends Cloudflare.DurableObject<Aula>()(
  "Aula",
  Effect.succeed(
    Effect.succeed({
      fetch: Effect.succeed(HttpServerResponse.empty({ status: 501 })),
      notify: (_topic: ClassroomTopic) => Effect.void,
    }),
  ),
) {}
