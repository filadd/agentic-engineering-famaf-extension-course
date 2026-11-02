import type { PollResults } from "@kurasu/contract/polls";

import { feedbackAnchors, feedbackFaces } from "../feedback-faces.ts";

interface Props {
  results: PollResults;
}

export const FeedbackResults = ({ results }: Props) => {
  const counts = results.feedback ?? [0, 0, 0, 0, 0];
  const highest = Math.max(1, ...counts);

  return (
    <div>
      <ul aria-label="Resultados" className="mt-3 grid grid-cols-5 items-end gap-2">
        {feedbackFaces.map((face, index) => {
          const count = counts[index] ?? 0;

          return (
            <li
              key={face}
              aria-label={`${index + 1} de 5`}
              className="flex flex-col items-center gap-1"
            >
              <div
                className="flex w-full items-end justify-center rounded-t-lg bg-lilac pb-0.5 text-xs"
                style={{ height: `${10 + (count / highest) * 60}px` }}
              >
                {count}
              </div>
              <div className="text-xl">{face}</div>
            </li>
          );
        })}
      </ul>
      <div className="mt-1 grid grid-cols-3 gap-2 text-xs opacity-70">
        <span>{feedbackAnchors[0]}</span>
        <span className="text-center">{feedbackAnchors[1]}</span>
        <span className="text-right">{feedbackAnchors[2]}</span>
      </div>
    </div>
  );
};
