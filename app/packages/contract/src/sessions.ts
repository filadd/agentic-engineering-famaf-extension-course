import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { OrderMismatch, SessionEnabled, SessionNotFound } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";

const Position = Schema.Int.check(Schema.isGreaterThanOrEqualTo(1));

// `enabled` only travels on the /api/admin endpoints; the student only ever
// sees enabled sessions.
export const SessionSummary = Schema.Struct({
  id: Ulid,
  title: Schema.String,
  summary: Schema.String,
  position: Schema.Int,
  enabled: Schema.optionalKey(Schema.Boolean),
});

export type SessionSummary = typeof SessionSummary.Type;

export const Session = Schema.Struct({
  ...SessionSummary.fields,
  currentSlide: Position,
  currentStep: Position,
});

export type Session = typeof Session.Type;

export const SessionInput = Schema.Struct({
  title: Schema.String.check(Schema.isMinLength(1)),
  summary: Schema.String,
});

export type SessionInput = typeof SessionInput.Type;

export const SessionChange = Schema.Struct({
  title: Schema.optionalKey(Schema.String.check(Schema.isMinLength(1))),
  summary: Schema.optionalKey(Schema.String),
  enabled: Schema.optionalKey(Schema.Boolean),
  currentSlide: Schema.optionalKey(Position),
  currentStep: Schema.optionalKey(Position),
});

export type SessionChange = typeof SessionChange.Type;

export class SessionsGroup extends HttpApiGroup.make("sessions")
  .add(
    HttpApiEndpoint.get("list", "/sessions", { success: Schema.Array(SessionSummary) }),
    HttpApiEndpoint.get("get", "/sessions/:id", {
      params: { id: Ulid },
      success: Session,
      error: SessionNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}

export class AdminSessionsGroup extends HttpApiGroup.make("adminSessions")
  .add(
    HttpApiEndpoint.get("list", "/admin/sessions", { success: Schema.Array(SessionSummary) }),
    HttpApiEndpoint.get("get", "/admin/sessions/:id", {
      params: { id: Ulid },
      success: Session,
      error: SessionNotFound,
    }),
    HttpApiEndpoint.post("create", "/admin/sessions", {
      payload: SessionInput,
      success: Session.pipe(HttpApiSchema.status(201)),
    }),
    HttpApiEndpoint.patch("update", "/admin/sessions/:id", {
      params: { id: Ulid },
      payload: SessionChange,
      success: Session,
      error: SessionNotFound,
    }),
    HttpApiEndpoint.delete("delete", "/admin/sessions/:id", {
      params: { id: Ulid },
      success: HttpApiSchema.NoContent,
      error: [SessionNotFound, SessionEnabled],
    }),
    HttpApiEndpoint.put("reorder", "/admin/session-order", {
      payload: Schema.Struct({ ids: Schema.Array(Ulid) }),
      success: HttpApiSchema.NoContent,
      error: OrderMismatch,
    }),
  )
  .middleware(CurrentUserMiddleware) {}
