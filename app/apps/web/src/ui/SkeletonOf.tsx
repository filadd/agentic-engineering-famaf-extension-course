import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

// The children are the real part filled with example data, so the skeleton
// takes the part's own shape; `.skeleton` greys it out and `inert` keeps it
// out of reach of the keyboard and the pointer.
export const SkeletonOf = ({ children }: Props) => (
  <div className="skeleton" inert aria-busy="true">
    {children}
  </div>
);
