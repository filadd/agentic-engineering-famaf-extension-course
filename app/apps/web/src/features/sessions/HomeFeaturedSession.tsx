import type { SessionSummary } from "@kurasu/contract/sessions";

import { usePolls } from "../polls/usePolls.ts";
import { useQuestionsByVotes } from "../questions/useQuestionsByVotes.ts";
import { FeaturedSession } from "./FeaturedSession.tsx";
import { FeaturedSessionSkeleton } from "./FeaturedSessionSkeleton.tsx";

interface Props {
  session: SessionSummary;
}

// The card waits for its polls and, when they are on, its questions, so it
// appears whole instead of filling in by parts.
export const HomeFeaturedSession = ({ session }: Props) => {
  const isWithQuestions = session.featuredQuestions;
  const polls = usePolls({ sessionId: session.id, status: "active" });
  const questions = useQuestionsByVotes(session.id, { enabled: isWithQuestions });

  return polls.data == null || (isWithQuestions && questions.data == null) ? (
    <FeaturedSessionSkeleton />
  ) : (
    <FeaturedSession
      session={session}
      polls={polls.data}
      questions={isWithQuestions ? questions.data : undefined}
    />
  );
};
