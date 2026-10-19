import { Link } from "@tanstack/react-router";

import { Icon } from "../../ui/Icon.tsx";

interface Props {
  sessionId: string;
}

export const PresentButton = ({ sessionId }: Props) => (
  <Link
    to="/admin/presentar/$id"
    params={{ id: sessionId }}
    target="_blank"
    className="pill-button ml-auto"
  >
    <Icon name="external-link" size={16} />
    Presentar en otra pestaña
  </Link>
);
