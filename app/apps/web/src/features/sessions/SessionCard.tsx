import type { SessionSummary } from "@kurasu/contract/sessions";
import type { ReactNode } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { sessionColor } from "./session-color.ts";

interface Props {
  session: SessionSummary;
  open: boolean;
  onToggle: () => void;
  status?: ReactNode;
  handle?: ReactNode;
  body?: ReactNode;
  actions?: ReactNode;
  painted?: boolean;
}

export const SessionCard = ({
  session,
  open,
  onToggle,
  status,
  handle,
  body,
  actions,
  painted = true,
}: Props) => (
  <article
    aria-label={session.title}
    className={`rounded-[22px] px-[18px] py-3 text-card-ink max-[600px]:px-3.5 max-[600px]:py-[11px] ${painted ? sessionColor(session.position) : "border-[1.5px] border-line text-ink"}`}
  >
    <div className="flex items-center gap-2.5">
      {handle}
      <h3 className="min-w-0 flex-1 text-xl font-bold max-[600px]:text-base">
        <button type="button" aria-expanded={open} onClick={onToggle} className="w-full text-left">
          {session.title}
        </button>
      </h3>
      {status}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onToggle}
        className="flex-none"
      >
        <Icon name={open ? "chevron-up" : "chevron-down"} size={20} />
      </button>
    </div>
    {open ? (
      <div>
        {body}
        {actions}
      </div>
    ) : null}
  </article>
);
