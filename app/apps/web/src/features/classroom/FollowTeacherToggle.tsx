import { Icon } from "../../ui/Icon.tsx";

interface Props {
  following: boolean;
  onToggle: () => void;
}

export const FollowTeacherToggle = ({ following, onToggle }: Props) => (
  <button
    type="button"
    aria-pressed={following}
    onClick={onToggle}
    className={`pill-button ml-auto ${following ? "pill-dark" : "border-dashed"}`}
  >
    <Icon name="presentation" size={18} />
    {following ? "Siguiendo al profe" : "Seguir al profe"}
  </button>
);
