import { Icon } from "../../ui/Icon.tsx";
import { useLowerStudentHand } from "./useLowerStudentHand.ts";

interface Props {
  sessionId: string;
  userId: string;
  name: string | null;
}

export const LowerHandButton = ({ sessionId, userId, name }: Props) => {
  const lower = useLowerStudentHand();

  return (
    <button
      type="button"
      title="Bajar la mano"
      aria-label={`Bajar la mano de ${name ?? ""}`}
      disabled={lower.isPending}
      onClick={() => lower.mutate({ sessionId, userId })}
      className="mr-0.5 ml-auto grid size-[26px] place-items-center rounded-full bg-peach text-coal hover:shadow-[0_0_0_2px_#1f1b18]"
    >
      <Icon name="hand" size={16} />
    </button>
  );
};
