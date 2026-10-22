import { Icon } from "./Icon.tsx";

interface Props {
  text: string;
  onClose: () => void;
}

export const SuccessToast = ({ text, onClose }: Props) => (
  <div
    role="status"
    className="flex w-full items-start gap-2.5 rounded-[18px] bg-paper py-3 pr-2 pl-3.5 font-sans text-[15px] leading-[1.4] text-coal shadow-[0_10px_30px_rgba(0,0,0,0.18)]"
  >
    <Icon name="check" size={20} className="mt-px" />
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
