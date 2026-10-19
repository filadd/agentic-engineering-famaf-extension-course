import type { AdminQuestion } from "@kurasu/contract/questions";

import { Icon } from "../../ui/Icon.tsx";
import { useAnswerQuestion } from "./useAnswerQuestion.ts";

interface Props {
  question: AdminQuestion;
}

export const AnsweredToggle = ({ question }: Props) => {
  const answer = useAnswerQuestion();

  return (
    <button
      type="button"
      title={question.answered ? "Volver a abrir" : "Marcar como respondida"}
      aria-label={question.answered ? "Volver a abrir" : "Marcar como respondida"}
      disabled={answer.isPending}
      onClick={() => answer.mutate({ id: question.id, answered: !question.answered })}
      className="icon-button text-coal hover:bg-mist"
    >
      <Icon name="check" size={16} />
    </button>
  );
};
