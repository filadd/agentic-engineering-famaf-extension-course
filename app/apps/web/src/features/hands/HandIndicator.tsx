import { Icon } from "../../ui/Icon.tsx";

export const HandIndicator = () => (
  <span
    title="Mano levantada"
    aria-label="Mano levantada"
    className="mr-0.5 ml-auto grid size-[26px] place-items-center rounded-full bg-peach text-coal"
  >
    <Icon name="hand" size={16} />
  </span>
);
