import type { AdminQuestion, Question } from "@kurasu/contract/questions";
import type { ReactNode } from "react";

import { QuestionRow } from "./QuestionRow.tsx";

interface Props<Q extends Question | AdminQuestion> {
  questions: ReadonlyArray<Q>;
  header?: ReactNode;
  renderVotes: (question: Q) => ReactNode;
  renderActions: (question: Q) => ReactNode;
  isDimmed?: (question: Q) => boolean;
}

export const QuestionList = <Q extends Question | AdminQuestion>({
  questions,
  header,
  renderVotes,
  renderActions,
  isDimmed,
}: Props<Q>) => (
  <div>
    {header}
    {questions.length === 0 ? (
      <div className="py-1.5 text-sm text-muted">Todavía no hay preguntas.</div>
    ) : (
      <ul aria-label="Preguntas">
        {questions.map((question) => (
          <QuestionRow
            key={question.id}
            question={question}
            votes={renderVotes(question)}
            actions={renderActions(question)}
            dimmed={isDimmed?.(question) ?? false}
          />
        ))}
      </ul>
    )}
  </div>
);
