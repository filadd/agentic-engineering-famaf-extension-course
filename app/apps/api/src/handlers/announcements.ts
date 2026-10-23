import { CurrentUser } from "@kurasu/contract/middleware";
import { Announcements } from "@kurasu/core/announcements/announcements";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";

import { KurasuApi } from "@kurasu/contract/api";

export const AdminAnnouncementsHandlers = HttpApiBuilder.group(
  KurasuApi,
  "adminAnnouncements",
  (handlers) =>
    handlers.handle("send", ({ payload }) =>
      Effect.gen(function* () {
        const announcements = yield* Announcements;

        yield* announcements.send(yield* CurrentUser, payload);
      }),
    ),
);
