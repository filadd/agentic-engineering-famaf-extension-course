import type { ReactNode } from "react";

import { Backdrop } from "./Backdrop.tsx";
import { Icon } from "./Icon.tsx";

interface Props {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: "narrow" | "normal" | "wide";
  pending?: boolean;
}

const widths = {
  narrow: "w-[min(420px,100%)]",
  normal: "w-[min(520px,100%)]",
  wide: "w-[min(640px,100%)]",
};

// Centred on a desktop; on a phone it rises from the bottom edge, full width.
// While its action waits for the API, nothing closes it, as with a
// confirmation: the user sees how it ends, in the sheet itself when it fails.
export const Sheet = ({
  open,
  onClose,
  title,
  children,
  width = "wide",
  pending = false,
}: Props) =>
  open ? (
    <Backdrop layer="sheet" onClose={onClose} dismissible={!pending}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`flex max-h-full flex-col overflow-hidden rounded-[22px] bg-window text-ink shadow-2xl max-[600px]:max-h-[88%] max-[600px]:w-full max-[600px]:rounded-b-none ${widths[width]}`}
      >
        <div className="mx-auto mt-2 hidden h-[5px] w-10 rounded-full bg-line max-[600px]:block" />
        <div className="flex items-center gap-2 pt-[18px] pr-[18px] pb-1.5 pl-6 max-[600px]:pt-3.5 max-[600px]:pl-[18px]">
          <h4 className="flex-1 text-xl font-bold">{title}</h4>
          <button
            type="button"
            title="Cerrar"
            aria-label="Cerrar"
            disabled={pending}
            onClick={onClose}
            className="icon-button"
          >
            <Icon name="x" size={22} />
          </button>
        </div>
        <div className="overflow-auto px-6 pt-1.5 pb-[22px] max-[600px]:px-[18px]">{children}</div>
      </div>
    </Backdrop>
  ) : null;
