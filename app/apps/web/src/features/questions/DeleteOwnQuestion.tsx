import type { Question } from "@kurasu/contract/questions";
import { useState } from "react";

import { ConfirmDialog } from "../../ui/ConfirmDialog.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDeleteQuestion } from "./useDeleteQuestion.ts";

interface Props {
  question: Question;
}

export const DeleteOwnQuestion = ({ question }: Props) => {
  const [confirming, setConfirming] = useState(false);

  const remove = useDeleteQuestion({ onSuccess: () => setConfirming(false) });

  return (
    <>
      <button
        type="button"
        title="Borrar tu pregunta"
        aria-label="Borrar tu pregunta"
        onClick={() => setConfirming(true)}
        className="grid size-7 flex-none place-items-center rounded-full text-stone hover:bg-mist hover:text-danger"
      >
        <Icon name="trash" size={16} />
      </button>
      <ConfirmDialog
        open={confirming}
        title="¿Borrar tu pregunta?"
        text="Se borra para todos, con sus votos."
        confirmLabel="Borrar"
        onConfirm={() => remove.mutate(question.id)}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
};
