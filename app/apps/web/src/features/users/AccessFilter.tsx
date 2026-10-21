import { Tabs } from "../../ui/Tabs.tsx";
import { accessFilters } from "./access-filter.ts";
import type { AccessFilterId } from "./access-filter.ts";

interface Props {
  counts: Record<AccessFilterId, number> | undefined;
  value: AccessFilterId;
  onChange: (filter: AccessFilterId) => void;
}

const ids: ReadonlyArray<AccessFilterId> = ["all", "on", "off"];

// Until the users arrive there are no counts, so the tabs never claim zero.
export const AccessFilter = ({ counts, value, onChange }: Props) => (
  <Tabs
    label="Filtrar por acceso"
    value={value}
    onChange={onChange}
    className="mt-3.5"
    tabs={ids.map((id) => ({
      id,
      label: counts == null ? accessFilters[id] : `${accessFilters[id]} (${counts[id]})`,
    }))}
  />
);
