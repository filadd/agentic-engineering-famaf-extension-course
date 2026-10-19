import type { PollType } from "@kurasu/contract/polls";
import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { pollTypeLabels } from "./poll-labels.ts";

interface Props {
  onPick: (type: PollType) => void;
}

const types: ReadonlyArray<PollType> = ["choice", "words", "scale"];

export const NewPollMenu = ({ onPick }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="pill-button pill-dark border-coal bg-coal text-white"
      >
        <Icon name="plus" size={16} />
        Nueva encuesta
        <Icon name="chevron-down" size={16} />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-11 right-0 z-20 min-w-[190px] rounded-[14px] border-[1.5px] border-line bg-window p-1.5 shadow-xl"
        >
          {types.map((type) => (
            <button
              key={type}
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                onPick(type);
              }}
              className="block w-full rounded-[10px] px-2.5 py-2 text-left text-sm text-ink hover:bg-line"
            >
              {pollTypeLabels[type]}
            </button>
          ))}
        </div>
      ) : null}
    </span>
  );
};
