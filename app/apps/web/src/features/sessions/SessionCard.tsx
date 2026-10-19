import type { SessionSummary } from "@kurasu/contract/sessions";
import type { ReactNode } from "react";

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
    className={`rounded-[22px] text-card-ink ${painted ? sessionColor(session.position) : "border-[1.5px] border-line text-ink"} ${
      open
        ? "px-[22px] py-5 max-[600px]:p-4"
        : "px-[18px] py-3 max-[600px]:px-3.5 max-[600px]:py-[11px]"
    }`}
  >
    <div className="flex items-center gap-2.5">
      {handle}
      <h3 className="min-w-0 flex-1 text-xl font-bold max-[600px]:text-base">
        <button type="button" aria-expanded={open} onClick={onToggle} className="w-full text-left">
          {session.title}
        </button>
      </h3>
      {status}
    </div>
    {open ? (
      <div>
        {body}
        {actions}
      </div>
    ) : null}
  </article>
);
