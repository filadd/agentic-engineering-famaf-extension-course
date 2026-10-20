import { ButtonLink } from "../../ui/ButtonLink.tsx";
import { Icon } from "../../ui/Icon.tsx";

interface Props {
  sessionId: string;
}

export const PresentButton = ({ sessionId }: Props) => (
  <ButtonLink
    variant="pill"
    to="/admin/presentar/$id"
    params={{ id: sessionId }}
    target="_blank"
    className="ml-auto"
  >
    <Icon name="external-link" size={16} />
    Presentar en otra pestaña
  </ButtonLink>
);
