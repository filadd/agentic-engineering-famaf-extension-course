import type { PollResults as Results, PollType, ResponseValue } from "@kurasu/contract/polls";

import { percent } from "./percent.ts";

interface Props {
  type: PollType;
  results: Results;
  options?: ReadonlyArray<string> | undefined;
  scaleLabels?: readonly [string, string] | undefined;
  mine?: ResponseValue | null | undefined;
  showCounts?: boolean;
}

const scaleValues = [1, 2, 3, 4, 5];

export const PollResults = ({
  type,
  results,
  options,
  scaleLabels,
  mine,
  showCounts = false,
}: Props) => {
  if (type === "choice") {
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
  }

  if (type === "scale") {
    const counts = results.scale ?? [0, 0, 0, 0, 0];
    const highest = Math.max(1, ...counts);
    const chosen = mine != null && "scale" in mine ? mine.scale : null;

    return (
      <div>
        <ul aria-label="Resultados" className="mt-2.5 grid grid-cols-5 items-end gap-2">
          {scaleValues.map((value, index) => (
            <li key={value} aria-current={value === chosen}>
              <div
                className={`flex items-end justify-center rounded-t-lg pb-0.5 text-xs ${
                  value === chosen ? "bg-coal text-white" : "bg-lilac"
                }`}
                style={{ height: `${10 + ((counts[index] ?? 0) / highest) * 60}px` }}
              >
                {counts[index] ?? 0}
              </div>
              <div className="text-center text-[13px]">{value}</div>
            </li>
          ))}
        </ul>
        {scaleLabels == null ? null : (
          <div className="mt-1 flex justify-between gap-2.5 text-xs opacity-70">
            <span>{scaleLabels[0]}</span>
            <span>{scaleLabels[1]}</span>
          </div>
        )}
      </div>
    );
  }

  const words = results.words ?? [];
  const highest = Math.max(1, ...words.map((entry) => entry.count));
  const own = mine != null && "words" in mine ? mine.words : [];

  return words.length === 0 ? (
    <div className="mt-2 text-sm opacity-70">Todavía sin palabras.</div>
  ) : (
    <ul
      aria-label="Resultados"
      className="flex flex-wrap items-baseline justify-center gap-x-3.5 gap-y-1 px-1.5 py-2.5"
    >
      {words.map((entry) => (
        <li
          key={entry.word}
          title={`${entry.word}: ${entry.count}`}
          aria-current={own.includes(entry.word)}
          className={`font-display leading-[1.1] font-bold ${own.includes(entry.word) ? "underline" : ""}`}
          style={{
            fontSize: `${14 + (entry.count / highest) * 24}px`,
            opacity: 0.55 + (entry.count / highest) * 0.45,
          }}
        >
          {entry.word}
          {showCounts ? (
            <span className="ml-1 align-super font-sans text-xs font-normal opacity-70">
              {entry.count}
            </span>
          ) : null}
        </li>
      ))}
    </ul>
  );
};
