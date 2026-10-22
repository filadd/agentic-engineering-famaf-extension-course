import type { ChangelogEntry } from "@kurasu/contract/changelog";
import * as Context from "effect/Context";

import type { Repository } from "../repository.ts";

export type NewChangelogEntry = Omit<ChangelogEntry, "createdAt">;

// The pending changelog entries of the sessions, at most one per type and
// entity. The store sets `createdAt` when it stores an entry.
export class ChangelogStore extends Context.Service<
  ChangelogStore,
  Pick<
    Repository<ChangelogEntry, NewChangelogEntry, never>,
    "upsert" | "list" | "getMany" | "remove" | "removeWhere"
  >
>()("kurasu/ChangelogStore") {}
