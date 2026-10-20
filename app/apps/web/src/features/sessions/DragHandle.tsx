import { Icon } from "../../ui/Icon.tsx";

export const DragHandle = () => (
  <span
    title="Arrastrar para reordenar"
    className="inline-grid cursor-grab opacity-45 hover:opacity-100"
  >
    <Icon name="grip-vertical" size={18} />
  </span>
);
