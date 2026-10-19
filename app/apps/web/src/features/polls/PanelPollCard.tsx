import type { AdminPoll } from "@kurasu/contract/polls";
import { useState } from "react";

import { PollCard } from "./PollCard.tsx";
import { pollTypeLabels } from "./poll-labels.ts";
import { PollPreview } from "./PollPreview.tsx";
import { PollStateActions } from "./PollStateActions.tsx";
import { PollStatusChip } from "./PollStatusChip.tsx";

interface Props {
  poll: AdminPoll;
}

const answers = (count: number) => `${count} ${count === 1 ? "respuesta" : "respuestas"}`;

// The classroom panel's card of a poll: it only activates and closes. A draft
// shows as the students will see it; the rest show their results. Closed
// polls start folded.
export const PanelPollCard = ({ poll }: Props) => {
  const [open, setOpen] = useState(poll.status !== "closed");

  return (
    <PollCard
      poll={poll}
      status={<PollStatusChip status={poll.status} />}
      meta={pollTypeLabels[poll.type]}
      open={open}
      onToggle={() => setOpen(!open)}
      showResults={poll.status !== "draft"}
      showCounts
      body={
        poll.status === "draft" ? (
          <PollPreview poll={poll} />
        ) : (
          <div className="mt-2 text-xs text-stone">{answers(poll.results.count)}</div>
        )
      }
      actions={
        poll.status === "closed" ? null : (
          <div className="mt-3 flex justify-end gap-2">
            <PollStateActions poll={poll} />
          </div>
        )
      }
    />
  );
};
