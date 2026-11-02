import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { pollExamples } from "../polls/poll-examples.ts";
import { questionExamples } from "../questions/question-examples.ts";
import { FeaturedSession } from "./FeaturedSession.tsx";
import { sessionExamples } from "./session-examples.ts";

// Always the same example card, questions included, so it keeps one size from
// the first load until the real card replaces it.
export const FeaturedSessionSkeleton = () => (
  <SkeletonOf>
    <FeaturedSession
      session={sessionExamples[2]}
      polls={[pollExamples[0]]}
      questions={questionExamples}
    />
  </SkeletonOf>
);
