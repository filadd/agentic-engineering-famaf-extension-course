import type { User } from "@kurasu/contract/user";

import { Tabs } from "../../ui/Tabs.tsx";
import { accessFilters, passesFilter } from "./access-filter.ts";
import type { AccessFilterId } from "./access-filter.ts";

interface Props {
  users: ReadonlyArray<User>;
  value: AccessFilterId;
  onChange: (filter: AccessFilterId) => void;
}

const ids: ReadonlyArray<AccessFilterId> = ["all", "on", "off"];

export const AccessFilter = ({ users, value, onChange }: Props) => (
  <Tabs
    label="Filtrar por acceso"
    value={value}
    onChange={onChange}
    className="mt-3.5"
    tabs={ids.map((id) => ({
      id,
      label: `${accessFilters[id]} (${users.filter((user) => passesFilter(user, id)).length})`,
    }))}
  />
);
