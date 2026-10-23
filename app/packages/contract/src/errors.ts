import * as Schema from "effect/Schema";

export class Unauthenticated extends Schema.TaggedError<Unauthenticated>()(
  "Unauthenticated",
  {},
  { httpApiStatus: 401 },
) {}

export class InvalidLink extends Schema.TaggedError<InvalidLink>()(
  "InvalidLink",
  {},
  { httpApiStatus: 401 },
) {}

export class NoAccess extends Schema.TaggedError<NoAccess>()(
  "NoAccess",
  {},
  { httpApiStatus: 403 },
) {}

export class NotTeacher extends Schema.TaggedError<NotTeacher>()(
  "NotTeacher",
  {},
  { httpApiStatus: 403 },
) {}

export class NotStudent extends Schema.TaggedError<NotStudent>()(
  "NotStudent",
  {},
  { httpApiStatus: 403 },
) {}

export class NotAuthor extends Schema.TaggedError<NotAuthor>()(
  "NotAuthor",
  {},
  { httpApiStatus: 403 },
) {}

export class NotRegistered extends Schema.TaggedError<NotRegistered>()(
  "NotRegistered",
  {},
  { httpApiStatus: 404 },
) {}

export class UserNotFound extends Schema.TaggedError<UserNotFound>()(
  "UserNotFound",
  {},
  { httpApiStatus: 404 },
) {}

export class SessionNotFound extends Schema.TaggedError<SessionNotFound>()(
  "SessionNotFound",
  {},
  { httpApiStatus: 404 },
) {}

export class PollNotFound extends Schema.TaggedError<PollNotFound>()(
  "PollNotFound",
  {},
  { httpApiStatus: 404 },
) {}

export class MaterialNotFound extends Schema.TaggedError<MaterialNotFound>()(
  "MaterialNotFound",
  {},
  { httpApiStatus: 404 },
) {}

export class QuestionNotFound extends Schema.TaggedError<QuestionNotFound>()(
  "QuestionNotFound",
  {},
  { httpApiStatus: 404 },
) {}

export class ChangelogEntryNotFound extends Schema.TaggedError<ChangelogEntryNotFound>()(
  "ChangelogEntryNotFound",
  {},
  { httpApiStatus: 404 },
) {}

export class EmailTaken extends Schema.TaggedError<EmailTaken>()(
  "EmailTaken",
  {},
  { httpApiStatus: 409 },
) {}

export class OwnAccess extends Schema.TaggedError<OwnAccess>()(
  "OwnAccess",
  {},
  { httpApiStatus: 409 },
) {}

export class SessionEnabled extends Schema.TaggedError<SessionEnabled>()(
  "SessionEnabled",
  {},
  { httpApiStatus: 409 },
) {}

export class SessionDisabled extends Schema.TaggedError<SessionDisabled>()(
  "SessionDisabled",
  {},
  { httpApiStatus: 409 },
) {}

export class OrderMismatch extends Schema.TaggedError<OrderMismatch>()(
  "OrderMismatch",
  {},
  { httpApiStatus: 409 },
) {}

export class PollNotActive extends Schema.TaggedError<PollNotActive>()(
  "PollNotActive",
  {},
  { httpApiStatus: 409 },
) {}

export class PollNotDraft extends Schema.TaggedError<PollNotDraft>()(
  "PollNotDraft",
  {},
  { httpApiStatus: 409 },
) {}

export class InvalidTransition extends Schema.TaggedError<InvalidTransition>()(
  "InvalidTransition",
  {},
  { httpApiStatus: 409 },
) {}

export class OwnQuestion extends Schema.TaggedError<OwnQuestion>()(
  "OwnQuestion",
  {},
  { httpApiStatus: 409 },
) {}

export class InvalidResponse extends Schema.TaggedError<InvalidResponse>()(
  "InvalidResponse",
  {},
  { httpApiStatus: 400 },
) {}

export class InvalidPollContent extends Schema.TaggedError<InvalidPollContent>()(
  "InvalidPollContent",
  {},
  { httpApiStatus: 400 },
) {}

export class EmptyAnnouncement extends Schema.TaggedError<EmptyAnnouncement>()(
  "EmptyAnnouncement",
  {},
  { httpApiStatus: 400 },
) {}

export class InvalidUpload extends Schema.TaggedError<InvalidUpload>()(
  "InvalidUpload",
  {},
  { httpApiStatus: 400 },
) {}

export class FileTooLarge extends Schema.TaggedError<FileTooLarge>()(
  "FileTooLarge",
  {},
  { httpApiStatus: 413 },
) {}

export class MailNotSent extends Schema.TaggedError<MailNotSent>()(
  "MailNotSent",
  {},
  { httpApiStatus: 502 },
) {}
