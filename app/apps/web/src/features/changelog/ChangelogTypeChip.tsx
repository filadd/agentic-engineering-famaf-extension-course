import { changelogTypeLabels, type ChangelogEntryType } from "@kurasu/contract/changelog";

import { changelogTypeColors } from "./changelog-type-colors.ts";

interface Props {
  type: ChangelogEntryType;
}

export const ChangelogTypeChip = ({ type }: Props) => (
  <span className={`rounded-full px-2 py-px text-[11px] text-coal ${changelogTypeColors[type]}`}>
    {changelogTypeLabels[type]}
  </span>
);
