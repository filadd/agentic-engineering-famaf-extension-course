import type { Session } from "@kurasu/contract/sessions";
import { useNavigate } from "@tanstack/react-router";

import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDeleteSession } from "./useDeleteSession.ts";

interface Props {
  session: Session;
}

export const DeleteSessionButton = ({ session }: Props) => {
  const navigate = useNavigate();

  const remove = useDeleteSession({ onSuccess: () => navigate({ to: "/admin" }) });

  return (
    <div className="mt-3 flex justify-end">
      <ConfirmAction
        renderTrigger={(ask) => (
          <button
            type="button"
            onClick={ask}
            className="pill-button border-[#e9b3bc] bg-paper text-danger"
          >
            <Icon name="trash" size={16} />
            Borrar sesión
          </button>
        )}
        title={`¿Borrar "${session.title}"?`}
        text="Se borran su material, sus encuestas y sus preguntas."
        confirmLabel="Borrar"
        onConfirm={() => remove.mutateAsync(session.id)}
      />
    </div>
  );
};
