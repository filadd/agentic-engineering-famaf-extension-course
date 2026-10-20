import { Icon } from "../../ui/Icon.tsx";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const UserSearch = ({ value, onChange }: Props) => (
  <label className="flex flex-1 items-center gap-2 rounded-full border-[1.5px] border-line bg-field px-3.5 text-muted">
    <Icon name="search" size={18} />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Buscar por nombre o email"
      aria-label="Buscar por nombre o email"
      className="min-w-0 flex-1 border-0 bg-transparent py-2.5 text-ink outline-none"
    />
  </label>
);
