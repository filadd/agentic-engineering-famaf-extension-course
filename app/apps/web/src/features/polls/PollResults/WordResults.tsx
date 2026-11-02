import type { PollResults, ResponseValue } from "@kurasu/contract/polls";

interface Props {
  results: PollResults;
  mine: ResponseValue | null | undefined;
  showCounts: boolean;
}

export const WordResults = ({ results, mine, showCounts }: Props) => {
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
