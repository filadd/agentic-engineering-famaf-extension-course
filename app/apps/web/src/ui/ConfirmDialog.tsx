import { Backdrop } from "./Backdrop.tsx";
import { Icon } from "./Icon.tsx";

interface Props {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog = ({ open, title, text, confirmLabel, onConfirm, onCancel }: Props) =>
  open ? (
    <Backdrop layer="alert" onClose={onCancel}>
      <div
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        className="w-[min(420px,100%)] rounded-[22px] bg-window p-6 text-ink shadow-2xl max-[600px]:w-full max-[600px]:rounded-b-none"
      >
        <h4 className="text-xl font-bold">{title}</h4>
        <p className="mt-2 leading-[1.45] text-muted">{text}</p>
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" className="pill-button" onClick={onCancel}>
            Cancelar
          </button>
          <button type="button" className="pill-button pill-danger" onClick={onConfirm}>
            <Icon name="trash" size={16} />
            {confirmLabel}
          </button>
        </div>
      </div>
    </Backdrop>
  ) : null;
