import type { Question } from "@kurasu/contract/questions";

import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDeleteQuestion } from "./useDeleteQuestion.ts";

interface Props {
  question: Question;
}

export const DeleteOwnQuestion = ({ question }: Props) => {
  const remove = useDeleteQuestion();

  return (
    <ConfirmAction
      renderTrigger={(ask) => (
        <button
          type="button"
          title="Borrar tu pregunta"
          aria-label="Borrar tu pregunta"
          onClick={ask}
          className="grid size-7 flex-none place-items-center rounded-full text-stone hover:bg-mist hover:text-danger"
        >
          <Icon name="trash" size={16} />
        </button>
      )}
      title="¿Borrar tu pregunta?"
      text="Se borra para todos, con sus votos."
      confirmLabel="Borrar"
      pendingLabel="Borrando…"
      errorText="No se pudo borrar tu pregunta. Probá de nuevo."
      onConfirm={() => remove.mutateAsync(question.id)}
    />
  );
};
