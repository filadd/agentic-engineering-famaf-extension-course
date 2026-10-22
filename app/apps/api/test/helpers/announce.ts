import { ChangelogEntry } from "@kurasu/contract/changelog";
import type { AnnouncementInput } from "@kurasu/contract/announcements";
import * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

import { bodyOf } from "./body.ts";
import { request } from "./http.ts";
import { cookieFor } from "./login.ts";

export const announce = (url: string, teacherId: string, input: AnnouncementInput) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(teacherId);

    return yield* request(url, "POST", "/api/admin/announcements", { cookie, body: input });
  });

export const pendingIds = (url: string, teacherId: string, sessionId: string) =>
  Effect.gen(function* () {
    const cookie = yield* cookieFor(teacherId);
    const path = `/api/admin/changelog?sessionId=${sessionId}`;

    const entries = yield* bodyOf(
      Schema.Array(ChangelogEntry),
      yield* request(url, "GET", path, { cookie }),
    );

    return entries.map((entry) => entry.id);
  });
