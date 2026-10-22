import type { ChangelogEntry } from "@kurasu/contract/changelog";
import * as DateTime from "effect/DateTime";

const entry = (n: number, type: ChangelogEntry["type"], name: string): ChangelogEntry => ({
  id: `example-entry-${n}`,
  sessionId: "example-session",
  type,
  entityId: `example-entity-${n}`,
  name,
  createdAt: DateTime.makeUnsafe(0),
});

// Names of the usual length, so the skeleton takes the height of a real list.
export const changelogExamples: ReadonlyArray<ChangelogEntry> = [
  entry(1, "session-enabled", "Planificación y revisión"),
  entry(2, "material-added", "Slides de la sesión.html"),
];
