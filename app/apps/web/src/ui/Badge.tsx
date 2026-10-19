interface Props {
  count: number;
  label: string;
}

export const Badge = ({ count, label }: Props) =>
  count > 0 ? (
    <span
      aria-label={label}
      className="inline-grid h-[18px] min-w-[18px] place-items-center rounded-full bg-live px-1 font-display text-[11px] font-bold text-white"
    >
      {count}
    </span>
  ) : null;
