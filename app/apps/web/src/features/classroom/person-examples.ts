import type { Person } from "@kurasu/contract/classroom";

const person = (n: number, name: string): Person => ({
  id: `example-person-${n}`,
  name,
  avatar: "fox",
  role: "student",
});

// What a skeleton draws in place of who is present.
export const personExamples: ReadonlyArray<Person> = [
  person(1, "Lucía Fernández"),
  person(2, "Tomás Ríos"),
  person(3, "Martina Gómez"),
];
