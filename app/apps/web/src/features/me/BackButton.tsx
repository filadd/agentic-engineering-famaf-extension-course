import { Link } from "@tanstack/react-router";

import { Icon } from "../../ui/Icon.tsx";

interface Props {
  to: "/" | "/admin";
  label: string;
}

export const BackButton = ({ to, label }: Props) => (
  <Link
    to={to}
    title={label}
    aria-label={label}
    className="grid size-10 flex-none place-items-center rounded-full text-ink hover:bg-line max-[600px]:size-9"
  >
    <Icon name="arrow-left" size={22} />
  </Link>
);
