import type { AnnouncementInput } from "@kurasu/contract/announcements";
import {
  EmptyAnnouncement,
  MailNotSent,
  SessionDisabled,
  type SessionNotFound,
} from "@kurasu/contract/errors";
import type { User } from "@kurasu/contract/user";
import * as Arr from "effect/Array";
import * as Context from "effect/Context";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";

import { Users } from "../access/users.ts";
import { ChangelogStore } from "../changelog/changelog-store.ts";
import { Mailer } from "../mail/mailer.ts";
import { SessionsStore } from "../sessions/sessions-store.ts";
import { existingSession } from "../sessions/visible-session.ts";

// Email Sending takes up to 50 addresses per mail, and the sender takes one.
const batchSize = 49;

// Sends the announcement of an enabled session by mail to the users with
// access, up to the first 100 who registered, the sender included. Chosen
// entries that are no longer pending in the session are left out. The batches
// go out at once and best effort: a failed batch is not retried, and the
// announcement counts as sent when at least one batch went out, or when there
// was nobody else to send it to. Then the included entries are deleted.
// `webOrigin` is where the link of the mail points: the home for the featured
// session, which it shows on top, and the home with `?sesion=<id>` for any
// other.
export class Announcements extends Context.Service<
  Announcements,
  {
    readonly send: (
      sender: User,
      input: AnnouncementInput,
    ) => Effect.Effect<void, SessionNotFound | SessionDisabled | EmptyAnnouncement | MailNotSent>;
  }
>()("kurasu/Announcements") {
  static readonly layer = (webOrigin: string) =>
    Layer.effect(
      Announcements,
      Effect.gen(function* () {
        const sessions = yield* SessionsStore;
        const changelog = yield* ChangelogStore;
        const users = yield* Users;
        const mailer = yield* Mailer;

        const sessionUrl = Effect.fnUntraced(function* (sessionId: string) {
          const featured = (yield* sessions.listEnabled()).at(-1);

          return featured?.id === sessionId
            ? `${webOrigin}/`
            : `${webOrigin}/?sesion=${encodeURIComponent(sessionId)}`;
        });

        return Announcements.of({
          send: Effect.fn("Announcements.send")(function* (sender, input) {
            const session = yield* existingSession(sessions, input.sessionId);

            if (!session.enabled) {
              return yield* new SessionDisabled();
            }

            const entries =
              input.entryIds.length === 0
                ? []
                : yield* changelog.list({
                    where: { id: input.entryIds, sessionId: session.id },
                    orderBy: { field: "createdAt", direction: "asc" },
                  });

            const message = input.message.trim() === "" ? "" : input.message;

            if (message === "" && entries.length === 0) {
              return yield* new EmptyAnnouncement();
            }

            const recipients = (yield* users.list({ where: { hasAccess: true } }))
              .filter((user) => user.id !== sender.id)
              .map((user) => user.email);

            const url = yield* sessionUrl(session.id);

            const sent = yield* Effect.forEach(
              Arr.chunksOf(recipients, batchSize),
              (bcc) =>
                mailer
                  .sendAnnouncement({
                    to: sender.email,
                    bcc,
                    sessionTitle: session.title,
                    message,
                    entries,
                    sessionUrl: url,
                  })
                  .pipe(
                    Effect.as(true),
                    Effect.catchTag("MailError", (error) =>
                      Effect.as(
                        Effect.logWarning(
                          "a batch of the announcement was not sent",
                          error.message,
                        ),
                        false,
                      ),
                    ),
                  ),
              { concurrency: "unbounded" },
            );

            if (sent.length > 0 && !sent.includes(true)) {
              return yield* new MailNotSent();
            }

            return yield* changelog
              .removeWhere({ id: entries.map((entry) => entry.id) })
              .pipe(Effect.asVoid);
          }),
        });
      }),
    );
}
