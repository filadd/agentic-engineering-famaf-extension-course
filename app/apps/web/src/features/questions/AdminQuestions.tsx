import { AnsweredToggle } from "./AnsweredToggle.tsx";
import { QuestionList } from "./QuestionList.tsx";
import { useAdminQuestions } from "./useAdminQuestions.ts";
import { VoteCount } from "./VoteCount.tsx";

interface Props {
  sessionId: string;
}

// Answered questions drop to the bottom, dimmed, so the open ones stay on top.
export const AdminQuestions = ({ sessionId }: Props) => {
  const questions = useAdminQuestions(sessionId);

  return (
    <QuestionList
      questions={(questions.data ?? []).toSorted(
        (a, b) => Number(a.answered) - Number(b.answered) || b.votes - a.votes,
      )}
      renderVotes={(question) => <VoteCount question={question} />}
      renderActions={(question) => <AnsweredToggle question={question} />}
      isDimmed={(question) => question.answered}
    />
  );
};
