import { ClosedPolls } from "./ClosedPolls.tsx";
import { PollCard } from "./PollCard.tsx";
import { pollMeta } from "./poll-meta.ts";
import { usePolls } from "./usePolls.ts";
import { VoteForm } from "./VoteForm.tsx";

interface Props {
  sessionId: string;
}

export const StudentPollsTab = ({ sessionId }: Props) => {
  const activePolls = usePolls({ sessionId, status: "active" });
  const closedPolls = usePolls({ sessionId, status: "closed" });

  return (
    <div>
      {activePolls.data == null || activePolls.data.length > 0 ? null : (
        <div className="text-sm text-muted">No hay encuestas activas.</div>
      )}
      <div className="flex flex-col gap-2.5">
        {(activePolls.data ?? []).map((poll) => (
          <PollCard
            key={poll.id}
            poll={poll}
            meta={pollMeta(poll)}
            showResults={false}
            body={<VoteForm poll={poll} />}
          />
        ))}
      </div>
      <section aria-label="Cerradas">
        <h3 className="mt-3.5 mb-1.5 font-display text-[13px] font-medium text-muted">Cerradas</h3>
        <ClosedPolls polls={closedPolls.data ?? []} />
      </section>
    </div>
  );
};
