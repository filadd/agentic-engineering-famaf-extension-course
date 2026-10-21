import type { User } from "@kurasu/contract/user";

import { Tabs } from "../../ui/Tabs.tsx";
import { accessFilters, passesFilter } from "./access-filter.ts";
import type { AccessFilterId } from "./access-filter.ts";

interface Props {
  users: ReadonlyArray<User> | undefined;
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
    tabs={ids.map((id) => {
      // Until the users arrive the tabs show no count, so they never claim zero.
      const count = users?.filter((user) => passesFilter(user, id)).length;

      return { id, label: count == null ? accessFilters[id] : `${accessFilters[id]} (${count})` };
    })}
  />
);
