import { Icon } from "./Icon.tsx";

const toastVariants = {
  success: { icon: "check", tone: "", role: "status" },
  error: { icon: "danger-circle", tone: "text-danger", role: "alert" },
} as const;

export type ToastVariant = keyof typeof toastVariants;

interface Props {
  variant: ToastVariant;
  text: string;
  onClose: () => void;
}

// sonner gives a custom toast no close button of its own, so the card brings
// its X; `w-full` fills the width sonner reserves for each toast.
export const Toast = ({ variant, text, onClose }: Props) => {
  const { icon, tone, role } = toastVariants[variant];

  return (
    <div
      role={role}
      className="flex w-full items-start gap-2.5 rounded-[18px] bg-paper py-3 pr-2 pl-3.5 font-sans text-[15px] leading-[1.4] text-coal shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
    >
      <Icon name={icon} size={20} className={`mt-px ${tone}`} />
      <span className="flex-1 pt-px">{text}</span>
      <button
        type="button"
        title="Cerrar"
        aria-label="Cerrar"
        onClick={onClose}
        className="icon-button -my-1.5 text-coal hover:bg-sand"
      >
        <Icon name="x" size={18} />
      </button>
    </div>
  );
};
