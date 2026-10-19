import { http, HttpResponse } from "msw";
import type { JsonBodyType } from "msw";
import * as Schema from "effect/Schema";

const statusOf = {
  Unauthenticated: 401,
  InvalidLink: 401,
  NoAccess: 403,
  NotTeacher: 403,
  NotStudent: 403,
  NotRegistered: 404,
  SessionNotFound: 404,
  PollNotFound: 404,
  EmailTaken: 409,
  OrderMismatch: 409,
  PollNotActive: 409,
  FileTooLarge: 413,
  MailNotSent: 502,
} as const;

export type ApiErrorTag = keyof typeof statusOf;

// The body HttpApi writes for a typed error.
export const apiError = (tag: ApiErrorTag) =>
  HttpResponse.json({ _tag: tag }, { status: statusOf[tag] });

export const url = (path: string) => `http://localhost:5173/api${path}`;

export const getJson = (path: string, body: JsonBodyType) =>
  http.get(url(path), () => HttpResponse.json(body));

export const noContent = () => new HttpResponse(null, { status: 204 });

// Decodes what the screen sent, so a handler reads it with its contract type.
export const readJson = async <S extends Schema.Decoder<unknown>>(request: Request, schema: S) =>
  Schema.decodeUnknownSync(schema)(await request.json());
