import type { AdminPoll } from "@kurasu/contract/polls";
import { useState } from "react";

import { ConfirmDialog } from "../../ui/ConfirmDialog.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDeletePoll } from "./useDeletePoll.ts";

interface Props {
  poll: AdminPoll;
}

export const DeletePollButton = ({ poll }: Props) => {
  const [confirming, setConfirming] = useState(false);

  const remove = useDeletePoll({ onSuccess: () => setConfirming(false) });

  return (
    <>
      <button
        type="button"
        className="pill-button border-sand text-coal"
        onClick={() => setConfirming(true)}
      >
        <Icon name="trash" size={16} />
        Borrar
      </button>
      <ConfirmDialog
        open={confirming}
        title={`¿Borrar "${poll.prompt}"?`}
        text={
          poll.status === "draft"
            ? "Se pierde lo que cargaste."
            : "Se borran sus respuestas y los estudiantes dejan de verla."
        }
        confirmLabel="Borrar"
        onConfirm={() => remove.mutate(poll.id)}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
};
