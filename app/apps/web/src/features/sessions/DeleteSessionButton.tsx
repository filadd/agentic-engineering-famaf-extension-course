import type { Session } from "@kurasu/contract/sessions";
import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ConfirmDialog } from "../../ui/ConfirmDialog.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDeleteSession } from "./useDeleteSession.ts";

interface Props {
  session: Session;
}

export const DeleteSessionButton = ({ session }: Props) => {
  const navigate = useNavigate();

  const [confirming, setConfirming] = useState(false);

  const remove = useDeleteSession({ onSuccess: () => navigate({ to: "/admin" }) });

  return (
    <div className="mt-3 flex justify-end">
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="pill-button border-[#e9b3bc] bg-paper text-danger"
      >
        <Icon name="trash" size={16} />
        Borrar sesión
      </button>
      <ConfirmDialog
        open={confirming}
        title={`¿Borrar "${session.title}"?`}
        text="Se borran su material, sus encuestas y sus preguntas."
        confirmLabel="Borrar"
        onConfirm={() => remove.mutate(session.id)}
        onCancel={() => setConfirming(false)}
      />
    </div>
  );
};
