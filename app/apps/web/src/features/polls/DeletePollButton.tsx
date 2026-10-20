import type { AdminPoll } from "@kurasu/contract/polls";

import { Button } from "../../ui/Button.tsx";
import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDeletePoll } from "./useDeletePoll.ts";

interface Props {
  poll: AdminPoll;
}

export const DeletePollButton = ({ poll }: Props) => {
  const remove = useDeletePoll();

  return (
    <ConfirmAction
      renderTrigger={(ask) => (
        <Button variant="pill" className="border-sand text-coal" onClick={ask}>
          <Icon name="trash" size={16} />
          Borrar
        </Button>
      )}
      title={`¿Borrar "${poll.prompt}"?`}
      text={
        poll.status === "draft"
          ? "Se pierde lo que cargaste."
          : "Se borran sus respuestas y los estudiantes dejan de verla."
      }
      confirmLabel="Borrar"
      pendingLabel="Borrando…"
      errorText="No se pudo borrar la encuesta. Probá de nuevo."
      onConfirm={() => remove.mutateAsync(poll.id)}
    />
  );
};
