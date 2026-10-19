import type { PollStatus } from "@kurasu/contract/polls";

import { pollStatusLabels } from "./poll-labels.ts";

interface Props {
  status: PollStatus;
}

const colors: Record<PollStatus, string> = {
  draft: "bg-[#efe6e0]",
  active: "bg-mint",
  closed: "bg-lilac",
};

export const PollStatusChip = ({ status }: Props) => (
  <span
    className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs text-coal ${colors[status]}`}
  >
    {pollStatusLabels[status]}
  </span>
);
