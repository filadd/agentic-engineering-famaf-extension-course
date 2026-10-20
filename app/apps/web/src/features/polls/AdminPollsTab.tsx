import type { PollType } from "@kurasu/contract/polls";
import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { AdminPollCard } from "./AdminPollCard.tsx";
import { NewPollCard } from "./NewPollCard.tsx";
import { NewPollMenu } from "./NewPollMenu.tsx";
import { adminPollExamples } from "./poll-examples.ts";
import { byStatus } from "./poll-order.ts";
import { useAdminPolls } from "./useAdminPolls.ts";

interface Props {
  sessionId: string;
}

export const AdminPollsTab = ({ sessionId }: Props) => {
  const polls = useAdminPolls(sessionId);

  const [creating, setCreating] = useState<PollType | null>(null);

  return (
    <div className="max-w-[760px]">
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-[17px] font-bold">
          <Icon name="chart-bar" size={18} />
          Encuestas
        </h2>
        <NewPollMenu onPick={setCreating} />
      </div>
      <div className="flex flex-col gap-2.5">
        {creating == null ? null : (
          <NewPollCard
            key={creating}
            sessionId={sessionId}
            type={creating}
            onDone={() => setCreating(null)}
          />
        )}
        {polls.data == null ? (
          <SkeletonOf>
            {adminPollExamples.map((poll) => (
              <AdminPollCard key={poll.id} poll={poll} />
            ))}
          </SkeletonOf>
        ) : (
          <>
            {polls.data.length === 0 ? (
              <div className="text-sm text-muted">Todavía no hay encuestas.</div>
            ) : null}
            {byStatus(polls.data).map((poll) => (
              <AdminPollCard key={poll.id} poll={poll} />
            ))}
          </>
        )}
      </div>
    </div>
  );
};
