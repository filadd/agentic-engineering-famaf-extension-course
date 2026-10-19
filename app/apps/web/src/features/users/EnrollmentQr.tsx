import { useState } from "react";

import { Backdrop } from "../../ui/Backdrop.tsx";
import { Button } from "../../ui/Button.tsx";
import { ConfirmDialog } from "../../ui/ConfirmDialog.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { enrollmentCodeExample } from "./enrollment-code-example.ts";
import { QrCode } from "./QrCode.tsx";
import { useEnrollmentCode } from "./useEnrollmentCode.ts";
import { useRegenerateEnrollmentCode } from "./useRegenerateEnrollmentCode.ts";

interface Props {
  onClose: () => void;
}

// The view the teacher projects in class: the QR and, next to it, the code to
// type by hand. Regenerating asks first, because the old code stops working.
export const EnrollmentQr = ({ onClose }: Props) => {
  const code = useEnrollmentCode();
  const regenerate = useRegenerateEnrollmentCode({ onSuccess: () => setConfirming(false) });

  const [confirming, setConfirming] = useState(false);

  const shown = code.data ?? enrollmentCodeExample;

  const codeView = (
    <div className="mt-[22px] mb-2.5 flex items-center justify-center gap-9">
      <div className="size-[340px] flex-none overflow-hidden rounded-[18px]">
        <QrCode text={shown.url} label={`QR de registro: ${shown.url}`} />
      </div>
      <div className="flex size-[340px] flex-none flex-col justify-center gap-2.5 rounded-[18px] bg-side p-6">
        <small className="text-lg text-muted">Código del aula</small>
        <b aria-label="Código del aula" className="font-display text-7xl tracking-[0.12em]">
          {shown.code}
        </b>
        <Button variant="main" className="mt-1.5 self-center" onClick={() => setConfirming(true)}>
          <Icon name="refresh" size={16} />
          Regenerar código
        </Button>
      </div>
    </div>
  );

  return (
    <Backdrop layer="projection" onClose={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="QR de registro"
        className="relative w-[min(900px,100%)] rounded-[28px] bg-window px-10 py-9 text-center text-ink shadow-2xl"
      >
        <button
          type="button"
          title="Cerrar"
          aria-label="Cerrar"
          onClick={onClose}
          className="icon-button absolute top-3.5 right-3.5"
        >
          <Icon name="x" size={24} />
        </button>
        <h3 className="text-[40px] font-bold">Sumate al aula</h3>
        <p className="mt-2 mb-1 text-lg text-muted">
          Escaneá el QR con el celular, o entrá a{" "}
          <b className="font-display text-ink">{globalThis.location.host}/registro</b> y escribí el
          código
        </p>
        {code.data == null ? <SkeletonOf>{codeView}</SkeletonOf> : codeView}
      </div>
      <ConfirmDialog
        open={confirming}
        title="¿Regenerar el código de registro?"
        text={`El código ${code.data?.code ?? ""} y su QR dejan de servir.`}
        confirmLabel="Regenerar"
        onConfirm={() => regenerate.mutate()}
        onCancel={() => setConfirming(false)}
      />
    </Backdrop>
  );
};
