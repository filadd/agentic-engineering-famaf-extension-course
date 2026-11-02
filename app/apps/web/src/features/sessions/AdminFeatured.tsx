import type { SessionSummary } from "@kurasu/contract/sessions";

import { OpenSessionLink } from "./OpenSessionLink.tsx";
import { sessionColor } from "./session-color.ts";

interface Props {
  session: SessionSummary;
}

export const AdminFeatured = ({ session }: Props) => (
  <section
    aria-label={session.title}
    className={`skeleton-block mt-6 rounded-[22px] p-[26px] text-card-ink ${sessionColor(session.position)}`}
  >
    <h2 className="text-[30px] font-bold">{session.title}</h2>
    <p className="mt-3 leading-[1.45]">{session.summary}</p>
    <OpenSessionLink sessionId={session.id} title={session.title} />
  </section>
);
