import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import {
  InvalidPollContent,
  InvalidResponse,
  InvalidTransition,
  NotStudent,
  PollNotActive,
  PollNotDraft,
  PollNotFound,
  SessionNotFound,
} from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";

export const maxOptions = 10;
export const maxWords = 10;
export const maxWordLength = 30;

export const PollType = Schema.Literals(["choice", "words", "scale"]);

export type PollType = typeof PollType.Type;

export const PollStatus = Schema.Literals(["draft", "active", "closed"]);

export type PollStatus = typeof PollStatus.Type;

export const VisiblePollStatus = Schema.Literals(["active", "closed"]);

export type VisiblePollStatus = typeof VisiblePollStatus.Type;

const Text = Schema.String.check(Schema.isMinLength(1));

export const PollOptions = Schema.Array(Text).check(
  Schema.isMinLength(2),
  Schema.isMaxLength(maxOptions),
);

const pollFields = {
  sessionId: Ulid,
  type: PollType,
  prompt: Text,
  options: Schema.optional(PollOptions),
  scaleMinLabel: Schema.optional(Schema.String),
  scaleMaxLabel: Schema.optional(Schema.String),
};

export const PollDraft = Schema.Struct(pollFields);

export type PollDraft = typeof PollDraft.Type;

export const PollChange = Schema.Struct({
  prompt: Schema.optionalKey(Text),
  options: Schema.optionalKey(PollOptions),
  scaleMinLabel: Schema.optionalKey(Schema.String),
  scaleMaxLabel: Schema.optionalKey(Schema.String),
  status: Schema.optionalKey(VisiblePollStatus),
});

export type PollChange = typeof PollChange.Type;

export const ResponseValue = Schema.Union([
  Schema.Struct({ choice: Schema.Int.check(Schema.isGreaterThanOrEqualTo(0)) }),
  Schema.Struct({ scale: Schema.Int.check(Schema.isBetween({ minimum: 1, maximum: 5 })) }),
  Schema.Struct({
    words: Schema.Array(
      Schema.String.check(Schema.isMinLength(1), Schema.isMaxLength(maxWordLength)),
    ).check(Schema.isMinLength(1), Schema.isMaxLength(maxWords)),
  }),
]);

export type ResponseValue = typeof ResponseValue.Type;

export const PollResults = Schema.Struct({
  count: Schema.Int,
  choice: Schema.optionalKey(Schema.Array(Schema.Int)),
  scale: Schema.optionalKey(
    Schema.Array(Schema.Int).check(Schema.isMinLength(5), Schema.isMaxLength(5)),
  ),
  words: Schema.optionalKey(
    Schema.Array(Schema.Struct({ word: Schema.String, count: Schema.Int })),
  ),
});

export type PollResults = typeof PollResults.Type;

export const Poll = Schema.Struct({
  ...pollFields,
  id: Ulid,
  status: VisiblePollStatus,
  myResponse: Schema.NullOr(ResponseValue),
  results: Schema.NullOr(PollResults),
});

export type Poll = typeof Poll.Type;

export const AdminPoll = Schema.Struct({
  ...pollFields,
  id: Ulid,
  status: PollStatus,
  results: PollResults,
});

export type AdminPoll = typeof AdminPoll.Type;

export class PollsGroup extends HttpApiGroup.make("polls")
  .add(
    HttpApiEndpoint.get("list", "/polls", {
      query: {
        sessionId: Schema.optionalKey(Ulid),
        status: Schema.optionalKey(VisiblePollStatus),
      },
      success: Schema.Array(Poll),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.patch("vote", "/polls/:id", {
      params: { id: Ulid },
      payload: Schema.Struct({ myResponse: ResponseValue }),
      success: Poll,
      error: [PollNotFound, PollNotActive, InvalidResponse, NotStudent],
    }),
  )
  .middleware(CurrentUserMiddleware) {}

export class AdminPollsGroup extends HttpApiGroup.make("adminPolls")
  .add(
    HttpApiEndpoint.get("list", "/admin/polls", {
      query: { sessionId: Ulid },
      success: Schema.Array(AdminPoll),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.post("create", "/admin/polls", {
      payload: PollDraft,
      success: AdminPoll.pipe(HttpApiSchema.status(201)),
      error: [SessionNotFound, InvalidPollContent],
    }),
    HttpApiEndpoint.patch("update", "/admin/polls/:id", {
      params: { id: Ulid },
      payload: PollChange,
      success: AdminPoll,
      error: [PollNotFound, PollNotDraft, InvalidTransition, InvalidPollContent],
    }),
    HttpApiEndpoint.delete("delete", "/admin/polls/:id", {
      params: { id: Ulid },
      success: HttpApiSchema.NoContent,
      error: PollNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}
