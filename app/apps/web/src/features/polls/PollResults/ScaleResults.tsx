import type { PollResults, ResponseValue } from "@kurasu/contract/polls";

interface Props {
  results: PollResults;
  scaleLabels: readonly [string, string] | undefined;
  mine: ResponseValue | null | undefined;
}

const scaleValues = [1, 2, 3, 4, 5];

export const ScaleResults = ({ results, scaleLabels, mine }: Props) => {
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
};
