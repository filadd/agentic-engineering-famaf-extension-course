import type { ReactNode } from "react";

export interface Tab<Id extends string> {
  id: Id;
  label: ReactNode;
  badge?: ReactNode;
}

interface Props<Id extends string> {
  tabs: ReadonlyArray<Tab<Id>>;
  value: Id;
  onChange: (id: Id) => void;
  label: string;
  className?: string;
}

export const Tabs = <Id extends string>({ tabs, value, onChange, label, className }: Props<Id>) => (
  <div role="tablist" aria-label={label} className={`flex flex-wrap gap-1.5 ${className ?? ""}`}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={tab.id === value}
        onClick={() => onChange(tab.id)}
        className={`inline-flex items-center gap-1.5 rounded-full border-[1.5px] px-3.5 py-1.5 text-sm ${
          tab.id === value
            ? "border-active bg-active text-active-ink"
            : "border-line bg-transparent text-ink hover:bg-line"
        }`}
      >
        {tab.label}
        {tab.badge}
      </button>
    ))}
  </div>
);
