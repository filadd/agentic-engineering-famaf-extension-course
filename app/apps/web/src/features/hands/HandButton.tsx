import { useIsMobile } from "../../helpers/useIsMobile.ts";
import { Button } from "../../ui/Button.tsx";
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
    <Button
      variant="pill"
      aria-pressed={raised}
      title={raised ? "Bajar la mano" : "Levantar la mano"}
      aria-label={raised ? "Bajar la mano" : "Levantar la mano"}
      disabled={raise.isPending || lower.isPending}
      onClick={() => (raised ? lower.mutate(sessionId) : raise.mutate(sessionId))}
      className={raised ? "border-peach bg-peach text-coal" : undefined}
    >
      <Icon name="hand" size={18} />
      {isMobile ? null : <span>{raised ? "Mano levantada" : "Levantar la mano"}</span>}
    </Button>
  );
};
