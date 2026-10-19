import type { SessionSummary } from "@kurasu/contract/sessions";

import { EnabledLabel } from "./EnabledLabel.tsx";
import { OpenSessionLink } from "./OpenSessionLink.tsx";
import { sessionColor } from "./session-color.ts";

interface Props {
  session: SessionSummary;
  number: number;
  total: number;
}

export const AdminHighlighted = ({ session, number, total }: Props) => (
  <section
    aria-label={session.title}
    className={`skeleton-block mt-6 rounded-[22px] p-[26px] text-card-ink ${sessionColor(session.position)}`}
  >
    <div className="flex items-center gap-2.5 text-sm">
      <span className="opacity-75">
        Sesión {number} de {total}
      </span>
      <EnabledLabel enabled />
    </div>
    <h2 className="mt-1 text-[30px] font-bold">{session.title}</h2>
    <p className="mt-3 leading-[1.45]">{session.summary}</p>
    <OpenSessionLink sessionId={session.id} title={session.title} />
  </section>
);
