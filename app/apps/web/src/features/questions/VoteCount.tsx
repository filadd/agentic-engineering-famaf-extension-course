import type { Question } from "@kurasu/contract/questions";

import { Icon } from "../../ui/Icon.tsx";

interface Props {
  question: Question;
}

export const VoteCount = ({ question }: Props) => (
  <div
    aria-label={`Votos: ${question.votes}`}
    className="flex min-w-[34px] flex-col items-center rounded-[10px] border-[1.5px] border-sand py-[3px] text-xs"
  >
    <Icon name="arrow-up" size={14} />
    {question.votes}
  </div>
);
