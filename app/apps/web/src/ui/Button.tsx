import type { ComponentProps } from "react";

import { Spinner } from "./Spinner.tsx";

const variants = {
  main: "main-button",
  pill: "pill-button",
  "pill-dark": "pill-button pill-dark",
  "pill-danger": "pill-button pill-danger",
} as const;

interface Props extends ComponentProps<"button"> {
  variant: keyof typeof variants;
  pending?: boolean;
  pendingLabel?: string;
}

// A pending button keeps its full colour: it is disabled because it is
// working, not because it cannot be used.
export const Button = ({
  variant,
  pending = false,
  pendingLabel,
  type = "button",
  disabled,
  className,
  children,
  ...rest
}: Props) => (
  <button
    {...rest}
    type={type}
    disabled={pending || disabled}
    aria-busy={pending ? true : undefined}
    className={`${variants[variant]}${pending ? " cursor-progress disabled:opacity-100" : ""}${
      className == null ? "" : ` ${className}`
    }`}
  >
    {pending ? (
      <>
        <Spinner />
        {pendingLabel ?? children}
      </>
    ) : (
      children
    )}
  </button>
);
