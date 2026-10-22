import { AnnouncementInput } from "@kurasu/contract/announcements";
import { ChangelogEntry } from "@kurasu/contract/changelog";
import * as Schema from "effect/Schema";
import { http, HttpResponse } from "msw";

import { apiError, noContent, readJson, url } from "./api.ts";

const encodeEntries = Schema.encodeSync(Schema.toCodecJson(Schema.Array(ChangelogEntry)));

// The changelog and announcement endpoints over an in-memory list. Discarding
// an entry that is not there answers ChangelogEntryNotFound, and an
// announcement removes the entries it includes, as the API does.
export const changelogStore = (initial: ReadonlyArray<ChangelogEntry>) => {
  let entries = [...initial];
  const announcements: Array<AnnouncementInput> = [];

  const handlers = [
    http.get(url("/admin/changelog"), ({ request }) => {
      const sessionId = new URL(request.url).searchParams.get("sessionId");

      return HttpResponse.json(
        encodeEntries(entries.filter((entry) => entry.sessionId === sessionId)),
      );
    }),
    http.delete(url("/admin/changelog/:id"), ({ params }) => {
      if (!entries.some((entry) => entry.id === params["id"])) {
        return apiError("ChangelogEntryNotFound");
      }

      entries = entries.filter((entry) => entry.id !== params["id"]);

      return noContent();
    }),
    http.post(url("/admin/announcements"), async ({ request }) => {
      const input = await readJson(request, AnnouncementInput);

      announcements.push(input);
      entries = entries.filter((entry) => !input.entryIds.includes(entry.id));

      return noContent();
    }),
  ];

  return {
    handlers,
    announcements,
    add: (entry: ChangelogEntry) => {
      entries = [...entries, entry];
    },
  };
};
