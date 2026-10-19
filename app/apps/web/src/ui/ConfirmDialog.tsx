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
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-coal/45 p-8 max-[600px]:items-end max-[600px]:p-0"
      onClick={(event) => (event.target === event.currentTarget ? onCancel() : undefined)}
    >
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
    </div>
  ) : null;
