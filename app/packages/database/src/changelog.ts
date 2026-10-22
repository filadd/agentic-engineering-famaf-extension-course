import { ChangelogEntry } from "@kurasu/contract/changelog";
import { ChangelogStore } from "@kurasu/core/changelog/changelog-store";
import * as Effect from "effect/Effect";
import * as Layer from "effect/Layer";
import * as Schema from "effect/Schema";

import { repositoryOf } from "./repository.ts";
import { changelogEntries } from "./schema.ts";

const decodeEntry = Schema.decodeUnknownEffect(
  Schema.Struct({ ...ChangelogEntry.fields, createdAt: Schema.DateTimeUtcFromDate }),
);

export const D1Changelog = Layer.effect(
  ChangelogStore,
  Effect.gen(function* () {
    const repository = yield* repositoryOf(changelogEntries, {
      decode: (row) => decodeEntry(row).pipe(Effect.orDie),
    });

    return ChangelogStore.of(repository);
  }),
);
