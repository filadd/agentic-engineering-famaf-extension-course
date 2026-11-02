import type { PollResults as Results, PollType, ResponseValue } from "@kurasu/contract/polls";

import { ChoiceResults } from "./ChoiceResults.tsx";
import { FeedbackResults } from "./FeedbackResults.tsx";
import { ScaleResults } from "./ScaleResults.tsx";
import { WordResults } from "./WordResults.tsx";

interface Props {
  type: PollType;
  results: Results;
  options?: ReadonlyArray<string> | undefined;
  scaleLabels?: readonly [string, string] | undefined;
  mine?: ResponseValue | null | undefined;
  showCounts?: boolean;
}

export const PollResults = ({
  type,
  results,
  options,
  scaleLabels,
  mine,
  showCounts = false,
}: Props) => {
  switch (type) {
    case "choice":
      return <ChoiceResults results={results} options={options} mine={mine} />;

    case "scale":
      return <ScaleResults results={results} scaleLabels={scaleLabels} mine={mine} />;

    case "feedback":
      return <FeedbackResults results={results} />;

    case "words":
      return <WordResults results={results} mine={mine} showCounts={showCounts} />;

    default:
      return type satisfies never;
  }
};
