import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export class MailError extends Schema.TaggedError<MailError>()("MailError", {
  message: Schema.String,
}) {}

export class Mailer extends Context.Service<
  Mailer,
  {
    readonly sendLink: (email: string, url: string) => Effect.Effect<void, MailError>;
  }
>()("kurasu/Mailer") {}
