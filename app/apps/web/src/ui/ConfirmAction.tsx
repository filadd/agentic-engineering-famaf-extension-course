import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { ConfirmDialog } from "./ConfirmDialog.tsx";

interface Props<A> extends Pick<
  ComponentProps<typeof ConfirmDialog>,
  "title" | "text" | "confirmLabel"
> {
  renderTrigger: (ask: () => void) => ReactNode;
  onConfirm: () => Promise<A>;
}

// The dialog closes once `onConfirm` succeeds and stays open when it fails;
// the query client already handles the error.
export const ConfirmAction = <A,>({ renderTrigger, onConfirm, ...dialog }: Props<A>) => {
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      {renderTrigger(() => setConfirming(true))}
      <ConfirmDialog
        {...dialog}
        open={confirming}
        onConfirm={() =>
          void onConfirm().then(
            () => setConfirming(false),
            () => undefined,
          )
        }
        onCancel={() => setConfirming(false)}
      />
    </>
  );
};
