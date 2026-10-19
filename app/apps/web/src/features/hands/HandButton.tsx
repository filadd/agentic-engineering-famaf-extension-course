import { useIsMobile } from "../../helpers/useIsMobile.ts";
import { Icon } from "../../ui/Icon.tsx";
import { useMe } from "../me/useMe.ts";
import { useLowerHand } from "./useLowerHand.ts";
import { useRaiseHand } from "./useRaiseHand.ts";
import { useRaisedHands } from "./useRaisedHands.ts";

interface Props {
  sessionId: string;
}

export const HandButton = ({ sessionId }: Props) => {
  const me = useMe();
  const hands = useRaisedHands(sessionId);
  const raise = useRaiseHand();
  const lower = useLowerHand();
  const isMobile = useIsMobile();

  const raised = (hands.data ?? []).some((hand) => hand.userId === me.data?.id);

  return (
    <button
      type="button"
      aria-pressed={raised}
      title={raised ? "Bajar la mano" : "Levantar la mano"}
      aria-label={raised ? "Bajar la mano" : "Levantar la mano"}
      disabled={raise.isPending || lower.isPending}
      onClick={() => (raised ? lower.mutate(sessionId) : raise.mutate(sessionId))}
      className={`pill-button ${raised ? "border-peach bg-peach text-coal" : ""}`}
    >
      <Icon name="hand" size={18} />
      {isMobile ? null : <span>{raised ? "Mano levantada" : "Levantar la mano"}</span>}
    </button>
  );
};
