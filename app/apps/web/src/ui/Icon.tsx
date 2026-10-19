import { icons } from "./icons.ts";
import type { IconName } from "./icons.ts";

interface Props {
  name: IconName;
  size?: number;
  className?: string;
}

export const Icon = ({ name, size = 20, className }: Props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth={1.5}
    aria-hidden="true"
    className={className == null ? "flex-none" : `flex-none ${className}`}
  >
    {icons[name].map((path) => (
      <path key={path} d={path} />
    ))}
  </svg>
);
