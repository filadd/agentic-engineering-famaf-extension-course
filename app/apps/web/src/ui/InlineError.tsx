import type { ReactNode } from "react";

import { Icon } from "./Icon.tsx";

interface Props {
  children: ReactNode;
  className?: string;
}

export const InlineError = ({ children, className }: Props) => (
  <div
    role="alert"
    className={`flex gap-2 rounded-[14px] bg-rose px-3.5 py-3 text-sm text-coal${
      className == null ? "" : ` ${className}`
    }`}
  >
    <Icon name="danger-circle" size={18} />
    <span>{children}</span>
  </div>
);
