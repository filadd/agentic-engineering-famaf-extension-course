import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { CrowMark } from "../../ui/CrowMark.tsx";
import { UserMenu } from "./UserMenu.tsx";

interface Props {
  title: ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
}

// The crow goes to / for both roles; the home sends the teacher on to /admin.
export const AppHeader = ({ title, leading, actions }: Props) => (
  <header className="flex items-center gap-3.5 max-[600px]:gap-2">
    {leading}
    <Link to="/" title="Ir al inicio" aria-label="Ir al inicio" className="flex-none">
      <CrowMark size="small" />
    </Link>
    <h1 className="min-w-0 flex-1 text-[30px] font-bold max-[600px]:text-2xl">{title}</h1>
    {actions}
    <UserMenu />
  </header>
);
