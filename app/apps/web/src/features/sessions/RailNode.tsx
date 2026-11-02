import type { ReactNode } from "react";

const looks = {
  done: "bg-active text-active-ink",
  live: "bg-live text-white shadow-[0_0_0_6px_color-mix(in_srgb,#e8505b_25%,transparent)] max-[600px]:shadow-[0_0_0_4px_color-mix(in_srgb,#e8505b_25%,transparent)]",
  later: "bg-line",
  locked: "border-2 border-dashed border-line text-muted",
  new: "border-2 border-dashed border-line text-muted",
};

export type RailNodeLook = keyof typeof looks;

interface Props {
  look: RailNodeLook;
  children: ReactNode;
}

export const RailNode = ({ look, children }: Props) => (
  <div
    className={`skeleton-block grid size-11 flex-none place-items-center rounded-full font-display font-bold max-[600px]:size-8 max-[600px]:text-sm ${looks[look]}`}
  >
    {children}
  </div>
);
