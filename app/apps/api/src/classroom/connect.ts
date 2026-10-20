import { Person } from "@kurasu/contract/classroom";
import { CurrentUser } from "@kurasu/contract/middleware";
import { Sessions } from "@kurasu/core/sessions/sessions";
import * as Effect from "effect/Effect";
import * as Headers from "effect/http/Headers";
import type { HttpServerError } from "effect/http/HttpServerError";
import type * as HttpServerRequest from "effect/http/HttpServerRequest";
import * as HttpServerResponse from "effect/http/HttpServerResponse";
import { HttpApiBuilder } from "effect/http-api";
import * as Schema from "effect/Schema";

import { KurasuApi } from "@kurasu/contract/api";
import { personHeader } from "./person-header.ts";

interface AulaStub {
  readonly fetch: (
    request: HttpServerRequest.HttpServerRequest,
  ) => Effect.Effect<HttpServerResponse.HttpServerResponse, HttpServerError>;
}

interface Aulas {
  readonly getByName: (name: string) => AulaStub;
}

const encodePerson = Schema.encodeSync(Schema.fromJsonString(Person));

// The WebSocket into the classroom of a session. The middleware already
// checked the login and the access; this checks who may enter this session's
// classroom and hands the upgrade to it, named after the session, with the
// person in an internal header.
export const ClassroomHandlers = (aulas: Aulas) =>
  HttpApiBuilder.group(KurasuApi, "classroom", (handlers) =>
    handlers.handle("connect", ({ query, request }) =>
      Effect.gen(function* () {
        const user = yield* CurrentUser;
        const sessions = yield* Sessions;

        yield* sessions.classroomOf(user, query.sessionId);

        if (request.headers["upgrade"]?.toLowerCase() !== "websocket") {
          return HttpServerResponse.empty({ status: 426 });
        }

        const person = encodePerson({
          id: user.id,
          name: user.name,
          avatar: user.avatar,
          role: user.role,
        });

        return yield* aulas
          .getByName(query.sessionId)
          .fetch(request.modify({ headers: Headers.set(request.headers, personHeader, person) }))
          .pipe(Effect.orDie);
      }),
    ),
  );
