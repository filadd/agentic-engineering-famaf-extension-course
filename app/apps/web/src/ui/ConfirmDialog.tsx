import { Backdrop } from "./Backdrop.tsx";
import { Button } from "./Button.tsx";
import { Icon } from "./Icon.tsx";
import { InlineError } from "./InlineError.tsx";

interface Props {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  pendingLabel: string;
  pending?: boolean;
  error?: string | undefined;
  onConfirm: () => void;
  onCancel: () => void;
}

// While the confirmation waits for the API, nothing closes the dialog: the
// teacher sees how it ends, in the dialog itself when it fails.
export const ConfirmDialog = ({
  open,
  title,
  text,
  confirmLabel,
  pendingLabel,
  pending = false,
  error,
  onConfirm,
  onCancel,
}: Props) =>
  open ? (
    <Backdrop layer="alert" onClose={pending ? () => undefined : onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="w-[min(420px,100%)] rounded-[22px] bg-window p-6 text-ink shadow-2xl max-[600px]:w-full max-[600px]:rounded-b-none"
      >
        <h4 className="text-xl font-bold">{title}</h4>
        <p className="mt-2 leading-[1.45] text-muted">{text}</p>
        {error == null ? null : <InlineError className="mt-4">{error}</InlineError>}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="pill" disabled={pending} onClick={onCancel}>
            Cancelar
          </Button>
          <Button
            variant="pill-danger"
            pending={pending}
            pendingLabel={pendingLabel}
            onClick={onConfirm}
          >
            <Icon name="trash" size={16} />
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Backdrop>
  ) : null;
