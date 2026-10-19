import type { AdminPoll } from "@kurasu/contract/polls";

import { scaleLabelsOf } from "./scale-labels.ts";

interface Props {
  poll: AdminPoll;
}

const scaleValues = [1, 2, 3, 4, 5];

// A poll as the student sees it before voting, without a way to vote.
export const PollPreview = ({ poll }: Props) => {
  if (poll.type === "choice") {
    return (
      <ul aria-label="Opciones" className="mt-3 flex flex-col gap-2">
        {(poll.options ?? []).map((option) => (
          <li
            key={option}
            className="rounded-xl border-2 border-sand bg-paper px-3.5 py-[9px] text-coal"
          >
            {option}
          </li>
        ))}
      </ul>
    );
  }

  if (poll.type === "scale") {
    const [minLabel, maxLabel] = scaleLabelsOf(poll);

    return (
      <div>
        <ul aria-label="Opciones" className="mt-2.5 grid grid-cols-5 gap-2">
          {scaleValues.map((value) => (
            <li
              key={value}
              className="rounded-[14px] border-2 border-coal bg-paper py-2 text-center text-xl text-coal"
            >
              {value}
            </li>
          ))}
        </ul>
        <div className="mt-1 flex justify-between gap-2.5 text-xs opacity-70">
          <span>{minLabel}</span>
          <span>{maxLabel}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2.5 rounded-full border-2 border-coal bg-paper px-3.5 py-[7px] text-stone">
      Tus palabras, separadas por coma
    </div>
  );
};
