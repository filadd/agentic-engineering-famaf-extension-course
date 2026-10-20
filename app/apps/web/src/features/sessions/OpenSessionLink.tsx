import { Link } from "@tanstack/react-router";

import { Icon } from "../../ui/Icon.tsx";

interface Props {
  sessionId: string;
  title: string;
}

export const OpenSessionLink = ({ sessionId, title }: Props) => (
  <div className="mt-4 flex justify-end">
    <Link
      to="/admin/sesiones/$id"
      params={{ id: sessionId }}
      aria-label={`Abrir ${title}`}
      className="inline-flex items-center gap-2 rounded-full bg-active px-[18px] py-2.5 font-display font-medium text-active-ink"
    >
      Abrir
      <Icon name="arrow-right" size={18} />
    </Link>
  </div>
);
