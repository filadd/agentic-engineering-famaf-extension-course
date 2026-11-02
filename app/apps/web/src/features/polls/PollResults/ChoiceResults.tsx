import type { PollResults, ResponseValue } from "@kurasu/contract/polls";

import { percent } from "../percent.ts";

interface Props {
  results: PollResults;
  options: ReadonlyArray<string> | undefined;
  mine: ResponseValue | null | undefined;
}

export const ChoiceResults = ({ results, options, mine }: Props) => {
  const counts = results.choice ?? [];
  const total = counts.reduce((sum, count) => sum + count, 0);
  const chosen = mine != null && "choice" in mine ? mine.choice : null;

  return (
    <ul aria-label="Resultados" className="mt-3 flex flex-col gap-2">
      {(options ?? []).map((option, index) => (
        <li
          key={option}
          aria-current={index === chosen}
          className={`relative flex justify-between gap-2.5 overflow-hidden rounded-xl border-2 bg-paper px-3.5 py-[9px] text-coal max-[600px]:px-3 max-[600px]:py-2.5 ${
            index === chosen ? "border-coal" : "border-sand"
          }`}
        >
          <i
            className="absolute inset-y-0 left-0 bg-peach opacity-60"
            style={{ width: `${percent(counts[index] ?? 0, total)}%` }}
          />
          <span className="relative">
            {index === chosen ? "✓ " : ""}
            {option}
          </span>
          <span className="relative">{percent(counts[index] ?? 0, total)}%</span>
        </li>
      ))}
    </ul>
  );
};
