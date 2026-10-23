import type { ChangelogEntry } from "@kurasu/contract/changelog";
import * as DateTime from "effect/DateTime";

export const entryDate = (entry: ChangelogEntry) =>
  DateTime.toDateUtc(entry.createdAt).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
  });
