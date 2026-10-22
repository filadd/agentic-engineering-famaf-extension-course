import { changelogLine, type ChangelogEntry } from "@kurasu/contract/changelog";

import { ChangelogTypeChip } from "./ChangelogTypeChip.tsx";
import { DiscardEntryButton } from "./DiscardEntryButton.tsx";
import { entryDate } from "./entry-date.ts";

interface Props {
  entry: ChangelogEntry;
  chosen: boolean;
  onToggle: () => void;
}

export const ChangelogEntryRow = ({ entry, chosen, onToggle }: Props) => (
  <li className="skeleton-block flex items-start gap-2 rounded-xl border-[1.5px] border-sand bg-paper py-2.5 pr-2 pl-3.5 text-coal">
    <input
      type="checkbox"
      aria-label={`Incluir ${entry.name}`}
      checked={chosen}
      onChange={onToggle}
      className="mt-1 size-4 accent-coal"
    />
    <div className="min-w-0 flex-1">
      <div className="mb-0.5 flex items-center gap-2">
        <ChangelogTypeChip type={entry.type} />
        <small className="text-[13px] text-stone">{entryDate(entry)}</small>
      </div>
      <b className="block truncate">{entry.name}</b>
      <small className="block text-[13px] text-stone">{changelogLine(entry)}</small>
    </div>
    <DiscardEntryButton entry={entry} />
  </li>
);
