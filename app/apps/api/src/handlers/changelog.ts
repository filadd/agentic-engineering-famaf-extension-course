import { Changelog } from "@kurasu/core/changelog/changelog";
import * as Effect from "effect/Effect";
import { HttpApiBuilder } from "effect/http-api";

import { KurasuApi } from "@kurasu/contract/api";

export const AdminChangelogHandlers = HttpApiBuilder.group(
  KurasuApi,
  "adminChangelog",
  (handlers) =>
    handlers
      .handle("list", ({ query }) =>
        Effect.gen(function* () {
          const changelog = yield* Changelog;

          return yield* changelog.list(query.sessionId);
        }),
      )
      .handle("discard", ({ params }) =>
        Effect.gen(function* () {
          const changelog = yield* Changelog;

          yield* changelog.discard(params.id);
        }),
      ),
);
