import type { ChangelogEntry } from "@kurasu/contract/changelog";
import * as DateTime from "effect/DateTime";

// The day and month of the change, in the browser's time zone, as 14/10.
export const entryDate = (entry: ChangelogEntry) =>
  DateTime.toDateUtc(entry.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  });
