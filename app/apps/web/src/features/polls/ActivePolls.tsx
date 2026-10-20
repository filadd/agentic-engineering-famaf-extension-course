import type { Poll } from "@kurasu/contract/polls";
import { useState } from "react";

import { PollCard } from "./PollCard.tsx";
import { pollMeta } from "./poll-meta.ts";
import { VoteForm } from "./VoteForm.tsx";

interface Props {
  polls: ReadonlyArray<Poll>;
}

export const ActivePolls = ({ polls }: Props) => {
  const [closedWhileVoting, setClosedWhileVoting] = useState(false);

  return polls.length === 0 && !closedWhileVoting ? null : (
    <div className="mt-3.5 flex flex-col gap-3">
      {closedWhileVoting ? (
        <div role="status" className="paper px-[18px] py-3 text-sm">
          El profe cerró esa encuesta antes de que votaras.
        </div>
      ) : null}
      {polls.map((poll) => (
        <PollCard
          key={poll.id}
          poll={poll}
          meta={pollMeta(poll)}
          showResults={false}
          body={<VoteForm poll={poll} onClosed={() => setClosedWhileVoting(true)} />}
        />
      ))}
    </div>
  );
};
