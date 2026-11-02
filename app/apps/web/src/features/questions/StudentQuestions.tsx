import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { questionExamples } from "./question-examples.ts";
import { QuestionForm } from "./QuestionForm.tsx";
import { StudentQuestionList } from "./StudentQuestionList.tsx";
import { useQuestionsByVotes } from "./useQuestionsByVotes.ts";

interface Props {
  sessionId: string;
  readOnly: boolean;
}

// The student's questions of a session, the most voted first. Only the
// featured session takes new questions and votes.
export const StudentQuestions = ({ sessionId, readOnly }: Props) => {
  const questions = useQuestionsByVotes(sessionId);

  const form = readOnly ? null : <QuestionForm sessionId={sessionId} />;

  return questions.data == null ? (
    <div>
      {form}
      <SkeletonOf>
        <StudentQuestionList questions={questionExamples} readOnly />
      </SkeletonOf>
    </div>
  ) : (
    <StudentQuestionList questions={questions.data} readOnly={readOnly} header={form} />
  );
};
