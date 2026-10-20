import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { NotStudent, SessionNotFound } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";
import { Animal } from "./user.ts";

// What the student sees of each raised hand: whose it is, so Presentes can mark it.
export const RaisedHandSummary = Schema.Struct({
  sessionId: Ulid,
  userId: Ulid,
});

export type RaisedHandSummary = typeof RaisedHandSummary.Type;

export const RaisedHand = Schema.Struct({
  sessionId: Ulid,
  user: Schema.Struct({
    id: Ulid,
    name: Schema.NullOr(Schema.String),
    avatar: Schema.NullOr(Animal),
  }),
});

export type RaisedHand = typeof RaisedHand.Type;

export class RaisedHandsGroup extends HttpApiGroup.make("raisedHands")
  .add(
    HttpApiEndpoint.get("list", "/raised-hands", {
      query: { sessionId: Ulid },
      success: Schema.Array(RaisedHandSummary),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.post("raise", "/raised-hands", {
      payload: Schema.Struct({ sessionId: Ulid }),
      success: RaisedHand.pipe(HttpApiSchema.status(201)),
      error: [SessionNotFound, NotStudent],
    }),
    HttpApiEndpoint.delete("lower", "/raised-hands", {
      query: { sessionId: Ulid },
      success: HttpApiSchema.NoContent,
      error: SessionNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}

export class AdminRaisedHandsGroup extends HttpApiGroup.make("adminRaisedHands")
  .add(
    HttpApiEndpoint.get("list", "/admin/raised-hands", {
      query: { sessionId: Ulid },
      success: Schema.Array(RaisedHand),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.delete("lower", "/admin/raised-hands", {
      query: { sessionId: Ulid, userId: Ulid },
      success: HttpApiSchema.NoContent,
      error: SessionNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}
