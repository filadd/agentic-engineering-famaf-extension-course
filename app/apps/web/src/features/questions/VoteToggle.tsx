import type { Question } from "@kurasu/contract/questions";

import { Icon } from "../../ui/Icon.tsx";
import { useVoteQuestion } from "./useVoteQuestion.ts";

interface Props {
  question: Question;
  readOnly: boolean;
}

export const VoteToggle = ({ question, readOnly }: Props) => {
  const vote = useVoteQuestion();

  return (
    <button
      type="button"
      title={question.myVote ? "Sacar tu voto" : "Votar"}
      aria-label={`Votos: ${question.votes}`}
      aria-pressed={question.myVote}
      disabled={question.mine || readOnly || vote.isPending}
      onClick={() => vote.mutate({ questionId: question.id, myVote: !question.myVote })}
      className={`flex min-w-9 flex-col items-center gap-px rounded-[10px] border-[1.5px] py-[3px] text-xs disabled:opacity-50 ${
        question.myVote ? "border-coal bg-coal text-white" : "border-sand bg-paper text-coal"
      }`}
    >
      <Icon name="arrow-up" size={14} />
      <span>{question.votes}</span>
    </button>
  );
};
