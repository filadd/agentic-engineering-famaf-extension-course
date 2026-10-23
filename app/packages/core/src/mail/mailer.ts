import type { ChangelogEntry } from "@kurasu/contract/changelog";
import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export class MailError extends Schema.TaggedError<MailError>()("MailError", {
  message: Schema.String,
}) {}

// One batch of an announcement: the teacher who sends it in To and up to 49
// other users in Bcc. `message` is empty when the teacher wrote none, and
// `entries` go from the oldest to the newest.
export interface AnnouncementMail {
  readonly to: string;
  readonly bcc: ReadonlyArray<string>;
  readonly sessionTitle: string;
  readonly message: string;
  readonly entries: ReadonlyArray<Pick<ChangelogEntry, "type" | "name">>;
  readonly sessionUrl: string;
}

export class Mailer extends Context.Service<
  Mailer,
  {
    readonly sendMagicLink: (email: string, url: string) => Effect.Effect<void, MailError>;
    readonly sendAnnouncement: (mail: AnnouncementMail) => Effect.Effect<void, MailError>;
  }
>()("kurasu/Mailer") {}
