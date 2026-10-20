import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { SessionNotFound } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";
import { Animal, Role } from "./user.ts";

export const ClassroomTopic = Schema.Literals([
  "slide",
  "polls",
  "questions",
  "hands",
  "material",
  "session",
]);

export type ClassroomTopic = typeof ClassroomTopic.Type;

export const Person = Schema.Struct({
  id: Ulid,
  name: Schema.NullOr(Schema.String),
  avatar: Schema.NullOr(Animal),
  role: Role,
});

export type Person = typeof Person.Type;

export const PresenceMessage = Schema.Struct({
  type: Schema.Literal("presence"),
  people: Schema.Array(Person),
});

export type PresenceMessage = typeof PresenceMessage.Type;

export const ChangedMessage = Schema.Struct({
  type: Schema.Literal("changed"),
  topic: ClassroomTopic,
});

export type ChangedMessage = typeof ChangedMessage.Type;

export const ClassroomMessage = Schema.Union([PresenceMessage, ChangedMessage]);

export type ClassroomMessage = typeof ClassroomMessage.Type;

// The WebSocket upgrade into the classroom of a session. The web opens it with
// partysocket rather than the typed client; the endpoint is here so the API
// implements it behind the same middleware and errors.
export class ClassroomGroup extends HttpApiGroup.make("classroom")
  .add(
    HttpApiEndpoint.get("connect", "/classroom", {
      query: { sessionId: Ulid },
      success: HttpApiSchema.Empty(101),
      error: SessionNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}
