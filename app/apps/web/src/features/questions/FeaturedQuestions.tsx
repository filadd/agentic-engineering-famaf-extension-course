import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { FeaturedQuestionsCard } from "./FeaturedQuestionsCard.tsx";
import { questionExamples } from "./question-examples.ts";
import { useQuestionsByVotes } from "./useQuestionsByVotes.ts";

interface Props {
  sessionId: string;
}

export const FeaturedQuestions = ({ sessionId }: Props) => {
  const questions = useQuestionsByVotes(sessionId);

  return questions.data == null ? (
    <SkeletonOf>
      <FeaturedQuestionsCard sessionId={sessionId} questions={questionExamples} />
    </SkeletonOf>
  ) : (
    <FeaturedQuestionsCard sessionId={sessionId} questions={questions.data} />
  );
};
