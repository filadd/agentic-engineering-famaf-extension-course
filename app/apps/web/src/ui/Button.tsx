import type { ComponentProps } from "react";

import { buttonClass, buttonVariants } from "./buttonVariants.ts";
import { Spinner } from "./Spinner.tsx";

interface Props extends ComponentProps<"button"> {
  variant: keyof typeof buttonVariants;
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
    className={`${buttonClass(variant, className)}${pending ? " cursor-progress disabled:opacity-100" : ""}`}
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
