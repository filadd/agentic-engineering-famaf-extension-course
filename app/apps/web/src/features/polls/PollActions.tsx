import type { AdminPoll } from "@kurasu/contract/polls";
import type { ReactNode } from "react";

import { DeletePollButton } from "./DeletePollButton.tsx";
import { useUpdatePoll } from "./useUpdatePoll.ts";

interface Props {
  poll: AdminPoll;
  draftActions?: ReactNode;
  canActivate?: boolean;
}

// The transitions only go forward: draft → active → closed.
export const PollActions = ({ poll, draftActions, canActivate = true }: Props) => {
  const transition = useUpdatePoll();

  return (
    <div className="mt-3 flex justify-end gap-2">
      <DeletePollButton poll={poll} />
      {draftActions}
      {poll.status === "draft" ? (
        <button
          type="button"
          className="pill-button pill-dark border-coal bg-coal text-white"
          disabled={!canActivate || transition.isPending}
          onClick={() => transition.mutate({ id: poll.id, change: { status: "active" } })}
        >
          Activar
        </button>
      ) : null}
      {poll.status === "active" ? (
        <button
          type="button"
          className="pill-button border-sand text-coal"
          disabled={transition.isPending}
          onClick={() => transition.mutate({ id: poll.id, change: { status: "closed" } })}
        >
          Cerrar
        </button>
      ) : null}
    </div>
  );
};
