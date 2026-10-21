import { Tabs } from "../../ui/Tabs.tsx";
import { accessFilterIds, accessFilters } from "./access-filter.ts";
import type { AccessCounts, AccessFilterId } from "./access-filter.ts";

interface Props {
  counts: AccessCounts | undefined;
  value: AccessFilterId;
  onChange: (filter: AccessFilterId) => void;
}

// Until the users arrive there are no counts, so the tabs never claim zero.
export const AccessFilter = ({ counts, value, onChange }: Props) => (
  <Tabs
    label="Filtrar por acceso"
    value={value}
    onChange={onChange}
    className="mt-3.5"
    tabs={accessFilterIds.map((id) => ({
      id,
      label: counts == null ? accessFilters[id] : `${accessFilters[id]} (${counts[id]})`,
    }))}
  />
);
