import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";

interface Props {
  sessionId: string;
}

export const PresentButton = ({ sessionId }: Props) => (
  <Button variant="pill" href={`/admin/presentar/${sessionId}`} target="_blank" className="ml-auto">
    <Icon name="external-link" size={16} />
    Presentar en otra pestaña
  </Button>
);
