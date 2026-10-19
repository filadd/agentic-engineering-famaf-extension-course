import type { AdminPoll } from "@kurasu/contract/polls";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { PollActions } from "./PollActions.tsx";
import { PollCard } from "./PollCard.tsx";
import { contentOf, fieldsOf, isComplete } from "./poll-content.ts";
import { pollTypeLabels } from "./poll-labels.ts";
import { PollEditor } from "./PollEditor.tsx";
import { PollStatusChip } from "./PollStatusChip.tsx";
import { useUpdatePoll } from "./useUpdatePoll.ts";

interface Props {
  poll: AdminPoll;
}

const answers = (count: number) => `${count} ${count === 1 ? "respuesta" : "respuestas"}`;

// The teacher's card of a poll. A draft is edited in place and saved before
// it can be activated; active and closed polls show their results, without
// who voted what. Active ones start open.
export const AdminPollCard = ({ poll }: Props) => {
  const [open, setOpen] = useState(poll.status === "active");
  const [draft, setDraft] = useState(contentOf(poll));

  const save = useUpdatePoll();

  const dirty = JSON.stringify(draft) !== JSON.stringify(contentOf(poll));

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
          <>
            <PollEditor type={poll.type} value={draft} onChange={setDraft} />
            {save.isError ? (
              <InlineError className="mt-3">
                No se pudo guardar la encuesta. Probá de nuevo.
              </InlineError>
            ) : null}
          </>
        ) : (
          <div className="mt-2 text-xs text-stone">{answers(poll.results.count)}</div>
        )
      }
      actions={
        <PollActions
          poll={poll}
          canActivate={!dirty}
          draftActions={
            poll.status === "draft" && dirty ? (
              <Button
                variant="pill"
                className="border-sand text-coal"
                disabled={!isComplete(poll.type, draft)}
                pending={save.isPending}
                pendingLabel="Guardando…"
                onClick={() => save.mutate({ id: poll.id, change: fieldsOf(poll.type, draft) })}
              >
                Guardar
              </Button>
            ) : null
          }
        />
      }
    />
  );
};
