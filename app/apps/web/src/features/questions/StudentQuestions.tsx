import { DeleteOwnQuestion } from "./DeleteOwnQuestion.tsx";
import { QuestionForm } from "./QuestionForm.tsx";
import { QuestionList } from "./QuestionList.tsx";
import { useQuestions } from "./useQuestions.ts";
import { VoteToggle } from "./VoteToggle.tsx";

interface Props {
  sessionId: string;
  readOnly: boolean;
}

// The student's questions of a session, the most voted first. Only the
// highlighted session takes new questions and votes.
export const StudentQuestions = ({ sessionId, readOnly }: Props) => {
  const questions = useQuestions(sessionId);

  return questions.data == null ? null : (
    <QuestionList
      questions={questions.data.toSorted((a, b) => b.votes - a.votes)}
      header={readOnly ? null : <QuestionForm sessionId={sessionId} />}
      renderVotes={(question) => <VoteToggle question={question} readOnly={readOnly} />}
      renderActions={(question) =>
        question.mine && !readOnly ? <DeleteOwnQuestion question={question} /> : null
      }
    />
  );
};
