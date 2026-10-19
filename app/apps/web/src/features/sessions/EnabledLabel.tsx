interface Props {
  enabled: boolean;
}

export const EnabledLabel = ({ enabled }: Props) => (
  <span className="inline-flex items-center gap-1.5 rounded-full bg-paper px-2.5 py-[3px] text-xs whitespace-nowrap text-coal">
    <span className={`size-2 rounded-full ${enabled ? "bg-[#3f9e6e]" : "bg-[#b9ada5]"}`} />
    {enabled ? "Habilitada" : "Deshabilitada"}
  </span>
);
