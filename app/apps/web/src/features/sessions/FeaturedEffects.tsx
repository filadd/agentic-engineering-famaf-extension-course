import type { SessionSummary } from "@kurasu/contract/sessions";

import { countLabel } from "../../ui/count-label.ts";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { useAdminRaisedHands } from "../hands/useAdminRaisedHands.ts";
import { useAdminPolls } from "../polls/useAdminPolls.ts";

interface Props {
  session: SessionSummary;
}

const pollsLine = (active: number) =>
  active === 0
    ? "No hay encuestas activas que cerrar."
    : `${active === 1 ? "Se cierra" : "Se cierran"} ${countLabel(active, "encuesta activa", "encuestas activas")}, el feedback incluido si está abierto.`;

const handsLine = (raised: number) =>
  raised === 0
    ? "No hay manos levantadas."
    : `${raised === 1 ? "Se baja" : "Se bajan"} ${countLabel(raised, "mano levantada", "manos levantadas")}.`;

// What the session that stops being featured loses; its unanswered questions
// and its slide stay.
export const FeaturedEffects = ({ session }: Props) => {
  const polls = useAdminPolls(session.id);
  const hands = useAdminRaisedHands(session.id);

  return polls.data == null || hands.data == null ? (
    <SkeletonOf>
      <ul className="mt-2.5 list-disc pl-5 text-sm">
        <li className="skeleton-block">{pollsLine(1)}</li>
        <li className="skeleton-block">{handsLine(1)}</li>
      </ul>
    </SkeletonOf>
  ) : (
    <ul className="mt-2.5 list-disc pl-5 text-sm leading-[1.45]">
      <li>{pollsLine(polls.data.filter((poll) => poll.status === "active").length)}</li>
      <li>{handsLine(hands.data.length)}</li>
      {session.featuredQuestions ? <li>Se apaga el modo de preguntas destacadas.</li> : null}
      <li>Las preguntas sin responder y la slide quedan como están.</li>
    </ul>
  );
};
