import type { Question } from "@kurasu/contract/questions";
import type { ReactNode } from "react";

import { DeleteOwnQuestion } from "./DeleteOwnQuestion.tsx";
import { QuestionList } from "./QuestionList.tsx";
import { VoteToggle } from "./VoteToggle.tsx";

interface Props {
  questions: ReadonlyArray<Question>;
  readOnly: boolean;
  header?: ReactNode;
  emptyText?: string | undefined;
}

export const StudentQuestionList = ({ questions, readOnly, header, emptyText }: Props) => (
  <QuestionList
    questions={questions}
    header={header}
    emptyText={emptyText}
    renderVotes={(question) => <VoteToggle question={question} readOnly={readOnly} />}
    renderActions={(question) =>
      question.mine && !readOnly ? <DeleteOwnQuestion question={question} /> : null
    }
  />
);
