import { useState } from "react";
import type { ComponentProps, ReactNode } from "react";

import { ConfirmDialog } from "./ConfirmDialog.tsx";

interface Props<A> extends Pick<
  ComponentProps<typeof ConfirmDialog>,
  "title" | "text" | "confirmLabel" | "pendingLabel"
> {
  renderTrigger: (ask: () => void) => ReactNode;
  onConfirm: () => Promise<A>;
  errorText: string;
}

type Step = "closed" | "asking" | "confirming" | "failed";

// The dialog closes once `onConfirm` succeeds; while it runs the dialog waits,
// and when it fails it stays open with `errorText`.
export const ConfirmAction = <A,>({ renderTrigger, onConfirm, errorText, ...dialog }: Props<A>) => {
  const [step, setStep] = useState<Step>("closed");

  return (
    <>
      {renderTrigger(() => setStep("asking"))}
      <ConfirmDialog
        {...dialog}
        open={step !== "closed"}
        pending={step === "confirming"}
        error={step === "failed" ? errorText : undefined}
        onConfirm={() => {
          setStep("confirming");
          void onConfirm().then(
            () => setStep("closed"),
            () => setStep("failed"),
          );
        }}
        onCancel={() => setStep("closed")}
      />
    </>
  );
};
