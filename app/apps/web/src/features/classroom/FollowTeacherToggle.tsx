import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";

interface Props {
  following: boolean;
  onToggle: () => void;
}

export const FollowTeacherToggle = ({ following, onToggle }: Props) => (
  <Button
    variant={following ? "pill-dark" : "pill"}
    aria-pressed={following}
    onClick={onToggle}
    className={following ? "ml-auto" : "ml-auto border-dashed"}
  >
    <Icon name="presentation" size={18} />
    {following ? "Siguiendo al profe" : "Seguir al profe"}
  </Button>
);
