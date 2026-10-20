import type { AdminPoll } from "@kurasu/contract/polls";

import { Button } from "../../ui/Button.tsx";
import { useUpdatePoll } from "./useUpdatePoll.ts";

interface Props {
  poll: AdminPoll;
  canActivate?: boolean;
}

// The transitions only go forward: draft → active → closed.
export const PollStateActions = ({ poll, canActivate = true }: Props) => {
  const transition = useUpdatePoll();

  if (poll.status === "draft") {
    return (
      <Button
        variant="pill-dark"
        className="border-coal bg-coal text-white"
        disabled={!canActivate || transition.isPending}
        onClick={() => transition.mutate({ id: poll.id, change: { status: "active" } })}
      >
        Activar
      </Button>
    );
  }

  return poll.status === "active" ? (
    <Button
      variant="pill"
      className="border-sand text-coal"
      disabled={transition.isPending}
      onClick={() => transition.mutate({ id: poll.id, change: { status: "closed" } })}
    >
      Cerrar
    </Button>
  ) : null;
};
