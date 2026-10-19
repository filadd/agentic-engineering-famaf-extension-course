import type { ReactNode } from "react";

import { UserMenu } from "./UserMenu.tsx";

interface Props {
  title: ReactNode;
  leading?: ReactNode;
  actions?: ReactNode;
}

export const AppHeader = ({ title, leading, actions }: Props) => (
  <header className="flex items-center gap-3.5 max-[600px]:gap-2">
    {leading}
    <h1 className="min-w-0 flex-1 text-[30px] font-bold max-[600px]:text-2xl">{title}</h1>
    {actions}
    <UserMenu />
  </header>
);
