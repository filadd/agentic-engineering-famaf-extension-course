import type { Person } from "@kurasu/contract/classroom";
import type { ReactNode } from "react";

import { Avatar } from "../me/Avatar.tsx";

interface Props {
  person: Person;
  isMe: boolean;
  hand: ReactNode;
}

export const PresenceRow = ({ person, isMe, hand }: Props) => (
  <li aria-label={person.name ?? ""} className="skeleton-block flex items-center gap-2.5 text-sm">
    <Avatar animal={person.avatar} size="small" />
    <span>{person.name}</span>
    {person.role === "teacher" ? (
      <span className="rounded-full bg-window px-2 py-px text-[11px] text-muted">Profe</span>
    ) : null}
    {isMe && person.role !== "teacher" ? (
      <span className="rounded-full bg-window px-2 py-px text-[11px] text-muted">Vos</span>
    ) : null}
    {hand}
  </li>
);
