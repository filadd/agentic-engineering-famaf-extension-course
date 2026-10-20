import type { Poll } from "@kurasu/contract/polls";
import { useState } from "react";

import { PollCard } from "./PollCard.tsx";
import { pollMeta } from "./poll-meta.ts";

interface Props {
  polls: ReadonlyArray<Poll>;
}

// An accordion: one closed poll open at a time, all folded at first.
export const ClosedPolls = ({ polls }: Props) => {
  const [openId, setOpenId] = useState<string | null>(null);

  return polls.length === 0 ? (
    <div className="py-1.5 text-sm text-muted">Todavía no hay encuestas cerradas.</div>
  ) : (
    <div className="mt-1.5 flex flex-col gap-2">
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          meta={pollMeta(poll)}
          showResults
          mine={poll.myResponse}
          bordered
          open={openId === poll.id}
          onToggle={() => setOpenId(openId === poll.id ? null : poll.id)}
        />
      ))}
    </div>
  );
};
