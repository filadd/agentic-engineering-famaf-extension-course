import type { AdminQuestion, Question } from "@kurasu/contract/questions";
import type { ReactNode } from "react";

interface Props {
  question: Question | AdminQuestion;
  votes: ReactNode;
  actions: ReactNode;
  dimmed?: boolean;
}

export const QuestionRow = ({ question, votes, actions, dimmed = false }: Props) => (
  <li
    aria-label={question.body}
    className={`mb-2 flex items-start gap-2.5 rounded-[14px] border-[1.5px] border-sand bg-paper px-3 py-2.5 text-sm leading-[1.35] text-coal ${
      dimmed ? "opacity-50" : ""
    }`}
  >
    {votes}
    <div className="min-w-0 flex-1">
      {question.body}
      {question.mine ? (
        <span className="ml-1.5 rounded-full bg-lilac px-1.5 text-[11px] whitespace-nowrap">
          Tuya
        </span>
      ) : null}
    </div>
    {actions}
  </li>
);
