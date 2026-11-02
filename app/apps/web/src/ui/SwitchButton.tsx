import type { ReactNode } from "react";

import { Switch } from "./Switch.tsx";

interface Props {
  isOn: boolean;
  disabled?: boolean | undefined;
  onClick: () => void;
  className: string;
  children: ReactNode;
}

export const SwitchButton = ({ isOn, disabled, onClick, className, children }: Props) => (
  <button
    type="button"
    role="switch"
    aria-checked={isOn}
    disabled={disabled}
    onClick={onClick}
    className={className}
  >
    {children}
    <Switch on={isOn} />
  </button>
);
