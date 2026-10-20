import type { AdminPoll, Poll, ResponseValue } from "@kurasu/contract/polls";
import type { ReactNode } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { PollResults } from "./PollResults.tsx";
import { scaleLabelsOf } from "./scale-labels.ts";

interface Props {
  poll: Poll | AdminPoll;
  meta: ReactNode;
  showResults: boolean;
  mine?: ResponseValue | null;
  status?: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  open?: boolean;
  onToggle?: () => void;
  bordered?: boolean;
  showCounts?: boolean;
}

// A poll as both sides show it. A card with `onToggle` folds: its header is
// the button, and the rest shows only while it is open.
export const PollCard = ({
  poll,
  meta,
  showResults,
  mine,
  status,
  body,
  actions,
  open = true,
  onToggle,
  bordered = false,
  showCounts = false,
}: Props) => {
  const header = (
    <span className="min-w-0 flex-1">
      {status}
      <span className="flex items-start gap-2 font-display font-medium">
        <Icon name="chart-bar" size={18} className="mt-0.5" />
        <span>{poll.prompt}</span>
      </span>
      <span className="mt-0.5 block text-[13px] opacity-70">{meta}</span>
    </span>
  );

  return (
    <article
      aria-label={poll.prompt}
      className={`skeleton-block paper px-[18px] py-4 max-[600px]:p-3.5 ${bordered ? "border-[1.5px] border-sand" : ""}`}
    >
      {onToggle == null ? (
        header
      ) : (
        <button
          type="button"
          aria-expanded={open}
          onClick={onToggle}
          className="flex w-full items-center justify-between gap-3 text-left text-coal"
        >
          {header}
          <Icon name={open ? "chevron-up" : "chevron-down"} size={18} />
        </button>
      )}
      {open ? body : null}
      {open && showResults && poll.results != null ? (
        <PollResults
          type={poll.type}
          results={poll.results}
          options={poll.options}
          scaleLabels={scaleLabelsOf(poll)}
          mine={mine}
          showCounts={showCounts}
        />
      ) : null}
      {open ? actions : null}
    </article>
  );
};
