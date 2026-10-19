import { Link } from "@tanstack/react-router";
import type { ComponentProps, ReactNode } from "react";

import { Spinner } from "./Spinner.tsx";

const variants = {
  main: "main-button",
  pill: "pill-button",
  "pill-dark": "pill-button pill-dark",
  "pill-danger": "pill-button pill-danger",
} as const;

interface Shared {
  variant: keyof typeof variants;
  pending?: boolean;
  pendingLabel?: string;
  children?: ReactNode;
}

// Either a link, with `href` and what the router's `Link` takes, or a button,
// with what a `<button>` takes.
type Props = Shared &
  (
    | (Omit<ComponentProps<typeof Link>, keyof Shared | "to" | "onClick"> & {
        href: string;
        onClick?: never;
      })
    | (Omit<ComponentProps<"button">, keyof Shared> & { href?: never })
  );

// A pending button keeps its full colour: it is disabled because it is
// working, not because it cannot be used. With `href` it is the router's link,
// so it navigates inside the app.
export const Button = (props: Props) => {
  const { variant, pending = false, pendingLabel, className, children } = props;

  const classes = `${variants[variant]}${pending ? " cursor-progress disabled:opacity-100" : ""}${
    className == null ? "" : ` ${className}`
  }`;

  const content = pending ? (
    <>
      <Spinner />
      {pendingLabel ?? children}
    </>
  ) : (
    children
  );

  if (props.href != null) {
    const {
      href,
      variant: _variant,
      pending: _pending,
      pendingLabel: _pendingLabel,
      className: _className,
      children: _children,
      ...rest
    } = props;

    return (
      <Link
        {...rest}
        to={href}
        aria-disabled={pending ? true : undefined}
        aria-busy={pending ? true : undefined}
        className={pending ? `${classes} pointer-events-none` : classes}
      >
        {content}
      </Link>
    );
  }

  const {
    href: _href,
    variant: _variant,
    pending: _pending,
    pendingLabel: _pendingLabel,
    className: _className,
    children: _children,
    type = "button",
    disabled,
    ...rest
  } = props;

  return (
    <button
      {...rest}
      type={type}
      disabled={pending || disabled}
      aria-busy={pending ? true : undefined}
      className={classes}
    >
      {content}
    </button>
  );
};
