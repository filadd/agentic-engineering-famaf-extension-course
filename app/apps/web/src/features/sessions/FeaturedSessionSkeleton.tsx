import type { SessionSummary } from "@kurasu/contract/sessions";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { pollExamples } from "../polls/poll-examples.ts";
import { questionExamples } from "../questions/question-examples.ts";
import { FeaturedSession } from "./FeaturedSession.tsx";
import { sessionExamples } from "./session-examples.ts";

interface Props {
  session?: SessionSummary | undefined;
}

// The same card while the sessions load and while its own parts load, so its
// size does not jump between the two.
export const FeaturedSessionSkeleton = ({ session = sessionExamples[2] }: Props) => (
  <SkeletonOf>
    <FeaturedSession
      session={session}
      polls={[pollExamples[0]]}
      questions={session.featuredQuestions ? questionExamples : undefined}
    />
  </SkeletonOf>
);
