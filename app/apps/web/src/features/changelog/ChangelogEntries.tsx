import type { ChangelogEntry } from "@kurasu/contract/changelog";

import { ChangelogEntryRow } from "./ChangelogEntryRow.tsx";

interface Props {
  entries: ReadonlyArray<ChangelogEntry>;
  chosen: ReadonlySet<string>;
  onToggle: (id: string) => void;
}

export const ChangelogEntries = ({ entries, chosen, onToggle }: Props) =>
  entries.length === 0 ? (
    <div className="rounded-2xl border-2 border-dashed border-line p-[18px] text-center text-sm text-muted">
      No hay novedades pendientes.
    </div>
  ) : (
    <ul aria-label="Novedades" className="flex flex-col gap-2">
      {entries.map((entry) => (
        <ChangelogEntryRow
          key={entry.id}
          entry={entry}
          chosen={chosen.has(entry.id)}
          onToggle={() => onToggle(entry.id)}
        />
      ))}
    </ul>
  );
