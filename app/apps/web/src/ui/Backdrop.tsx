import type { ReactNode } from "react";

import { useCloseOnEscape } from "./useCloseOnEscape.ts";

interface Props {
  layer: "sheet" | "alert" | "projection";
  onClose: () => void;
  children: ReactNode;
}

// Sheets and alerts rise from the bottom edge on a phone; the projected view
// stays centred and darker, for the classroom screen.
const layers = {
  sheet: "z-40 bg-coal/45 max-[600px]:items-end max-[600px]:p-0",
  alert: "z-50 bg-coal/45 max-[600px]:items-end max-[600px]:p-0",
  projection: "z-40 bg-coal/70",
};

// A click on the backdrop itself closes, but not one inside its content.
export const Backdrop = ({ layer, onClose, children }: Props) => {
  useCloseOnEscape(onClose);

  return (
    <div
      className={`fixed inset-0 grid place-items-center p-8 ${layers[layer]}`}
      onClick={(event) => (event.target === event.currentTarget ? onClose() : undefined)}
    >
      {children}
    </div>
  );
};
