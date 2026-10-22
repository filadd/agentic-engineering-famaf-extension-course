import * as Schema from "effect/Schema";
import { HttpApiEndpoint, HttpApiGroup, HttpApiSchema } from "effect/http-api";

import { ChangelogEntryNotFound, SessionNotFound } from "./errors.ts";
import { CurrentUserMiddleware } from "./middleware.ts";
import { Ulid } from "./ulid.ts";

export const changelogEntryTypes = {
  sessionEnabled: "session-enabled",
  materialAdded: "material-added",
  pollOpened: "poll-opened",
} as const;

export const ChangelogEntryType = Schema.Literals(Object.values(changelogEntryTypes));

export type ChangelogEntryType = typeof ChangelogEntryType.Type;

export const maxChangelogEntries = 100;

// Something new in a session that the teacher has not announced yet. `name`
// keeps the session title, material name or poll prompt as it was when the
// entry was recorded.
export const ChangelogEntry = Schema.Struct({
  id: Ulid,
  sessionId: Ulid,
  type: ChangelogEntryType,
  entityId: Ulid,
  name: Schema.String,
  createdAt: Schema.DateTimeUtc,
});

export type ChangelogEntry = typeof ChangelogEntry.Type;

export const changelogTypeLabels: Record<ChangelogEntryType, string> = {
  "session-enabled": "Sesión habilitada",
  "material-added": "Material nuevo",
  "poll-opened": "Encuesta abierta",
};

const linePrefixes: Record<ChangelogEntryType, string> = {
  "session-enabled": "Se habilitó la sesión",
  "material-added": "Se agregó el material",
  "poll-opened": "Se abrió la encuesta",
};

// The line the admin column and the announcement mail show for an entry.
export const changelogLine = ({ type, name }: Pick<ChangelogEntry, "type" | "name">) =>
  `${linePrefixes[type]} "${name}".`;

export class AdminChangelogGroup extends HttpApiGroup.make("adminChangelog")
  .add(
    HttpApiEndpoint.get("list", "/admin/changelog", {
      query: { sessionId: Ulid },
      success: Schema.Array(ChangelogEntry).check(Schema.isMaxLength(maxChangelogEntries)),
      error: SessionNotFound,
    }),
    HttpApiEndpoint.delete("discard", "/admin/changelog/:id", {
      params: { id: Ulid },
      success: HttpApiSchema.NoContent,
      error: ChangelogEntryNotFound,
    }),
  )
  .middleware(CurrentUserMiddleware) {}
