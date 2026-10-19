import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { AdminPollCard } from "./AdminPollCard.tsx";
import { adminPollExamples } from "./poll-examples.ts";
import { byStatus } from "./poll-order.ts";
import { useAdminPolls } from "./useAdminPolls.ts";

interface Props {
  sessionId: string;
}

// The polls in the classroom's panel: the active and draft ones, and the
// closed ones folded apart.
export const AdminPanelPolls = ({ sessionId }: Props) => {
  const polls = useAdminPolls(sessionId);

  const [closedOpen, setClosedOpen] = useState(false);

  if (polls.data == null) {
    return (
      <SkeletonOf>
        <div className="flex flex-col gap-2.5">
          {adminPollExamples.map((poll) => (
            <AdminPollCard key={poll.id} poll={poll} />
          ))}
        </div>
      </SkeletonOf>
    );
  }

  const all = byStatus(polls.data);
  const current = all.filter((poll) => poll.status !== "closed");
  const closed = all.filter((poll) => poll.status === "closed");

  return (
    <div className="flex flex-col gap-2.5">
      {current.length === 0 ? <div className="text-sm text-muted">No hay encuestas.</div> : null}
      {current.map((poll) => (
        <AdminPollCard key={poll.id} poll={poll} />
      ))}
      {closed.length === 0 ? null : (
        <section aria-label="Cerradas">
          <button
            type="button"
            aria-expanded={closedOpen}
            onClick={() => setClosedOpen(!closedOpen)}
            className="flex w-full items-center justify-between px-0.5 py-2 font-display text-[13px] font-medium text-muted"
          >
            Cerradas ({closed.length})
            <Icon name={closedOpen ? "chevron-up" : "chevron-down"} size={16} />
          </button>
          {closedOpen ? (
            <div className="flex flex-col gap-2.5">
              {closed.map((poll) => (
                <AdminPollCard key={poll.id} poll={poll} />
              ))}
            </div>
          ) : null}
        </section>
      )}
    </div>
  );
};
