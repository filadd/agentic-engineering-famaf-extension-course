import { createLink } from "@tanstack/react-router";
import type { ComponentProps } from "react";

import { buttonClass, buttonVariants } from "./buttonVariants.ts";

interface Props extends ComponentProps<"a"> {
  variant: keyof typeof buttonVariants;
}

// `createLink` wraps the anchor so each link keeps the router's check of its
// path and params, as `Link` does.
export const ButtonLink = createLink(({ variant, className, ...rest }: Props) => (
  <a {...rest} className={buttonClass(variant, className)} />
));
