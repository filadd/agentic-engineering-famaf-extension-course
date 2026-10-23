import type { ChangelogEntry } from "@kurasu/contract/changelog";
import * as DateTime from "effect/DateTime";

import { ulid } from "./ids.ts";

// An entry recorded on `day` of October 2026, at noon in Argentina.
export const changelogEntry = (
  n: number,
  sessionId: string,
  type: ChangelogEntry["type"],
  name: string,
  day: number,
): ChangelogEntry => ({
  id: ulid("E", n),
  sessionId,
  type,
  entityId: ulid("N", n),
  name,
  createdAt: DateTime.makeUnsafe(`2026-10-${String(day).padStart(2, "0")}T15:00:00Z`),
});
