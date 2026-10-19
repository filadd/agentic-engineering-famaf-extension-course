import type { User } from "@kurasu/contract/user";

export const accessFilters = {
  all: "Todos",
  on: "Con acceso",
  off: "Sin acceso",
} as const;

export type AccessFilterId = keyof typeof accessFilters;

export const passesFilter = (user: User, filter: AccessFilterId) =>
  filter === "all" || (filter === "on" ? user.hasAccess : !user.hasAccess);
