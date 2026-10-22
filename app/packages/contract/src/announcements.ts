import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { maxChangelogEntries } from "./changelog.ts";
import { EmptyAnnouncement, MailNotSent, SessionDisabled, SessionNotFound } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";

// A message that is empty or only spaces counts as no message.
export const AnnouncementInput = Schema.Struct({
  sessionId: Ulid,
  message: Schema.String,
  entryIds: Schema.Array(Ulid).check(Schema.isMaxLength(maxChangelogEntries)),
});

export type AnnouncementInput = typeof AnnouncementInput.Type;

export class AdminAnnouncementsGroup extends HttpApiGroup.make("adminAnnouncements")
  .add(
    HttpApiEndpoint.post("send", "/admin/announcements", {
      payload: AnnouncementInput,
      success: HttpApiSchema.NoContent,
      error: [SessionNotFound, SessionDisabled, EmptyAnnouncement, MailNotSent],
    }),
  )
  .middleware(CurrentUserMiddleware) {}
