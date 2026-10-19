import type { Person } from "@kurasu/contract/classroom";
import type { ReactNode } from "react";

import { PresenceRow } from "./PresenceRow.tsx";

interface Props {
  people: ReadonlyArray<Person>;
  meId: string | undefined;
  renderHand: (person: Person) => ReactNode;
}

// The teacher goes first; the rest keep the order the classroom sends.
export const PresenceList = ({ people, meId, renderHand }: Props) => (
  <ul aria-label="Presentes" className="flex flex-col gap-1.5">
    {people
      .toSorted((a, b) => Number(b.role === "teacher") - Number(a.role === "teacher"))
      .map((person) => (
        <PresenceRow
          key={person.id}
          person={person}
          isMe={person.id === meId}
          hand={renderHand(person)}
        />
      ))}
  </ul>
);
