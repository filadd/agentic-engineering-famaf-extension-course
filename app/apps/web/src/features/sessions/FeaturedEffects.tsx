import type { SessionSummary } from "@kurasu/contract/sessions";

import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { useAdminRaisedHands } from "../hands/useAdminRaisedHands.ts";
import { useAdminPolls } from "../polls/useAdminPolls.ts";

interface Props {
  session: SessionSummary;
}

const countLabel = (count: number, one: string, many: string) =>
  `${count} ${count === 1 ? one : many}`;

// What the session that stops being featured loses; its unanswered questions
// and its slide stay.
export const FeaturedEffects = ({ session }: Props) => {
  const polls = useAdminPolls(session.id);
  const hands = useAdminRaisedHands(session.id);

  const active = polls.data?.filter((poll) => poll.status === "active").length;

  return polls.data == null || hands.data == null ? (
    <SkeletonOf>
      <ul className="mt-2.5 list-disc pl-5 text-sm">
        <li className="skeleton-block">Se cierra 1 encuesta activa.</li>
        <li className="skeleton-block">Se baja 1 mano levantada.</li>
      </ul>
    </SkeletonOf>
  ) : (
    <ul className="mt-2.5 list-disc pl-5 text-sm leading-[1.45]">
      <li>
        {active === 0 || active == null
          ? "No hay encuestas activas que cerrar."
          : `${active === 1 ? "Se cierra" : "Se cierran"} ${countLabel(active, "encuesta activa", "encuestas activas")}, el feedback incluido si está abierto.`}
      </li>
      <li>
        {hands.data.length === 0
          ? "No hay manos levantadas."
          : `${hands.data.length === 1 ? "Se baja" : "Se bajan"} ${countLabel(hands.data.length, "mano levantada", "manos levantadas")}.`}
      </li>
      {session.featuredQuestions ? <li>Se apaga el modo de preguntas destacadas.</li> : null}
      <li>Las preguntas sin responder y la slide quedan como están.</li>
    </ul>
  );
};
