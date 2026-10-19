import type { User } from "@kurasu/contract/user";

const user = (n: number, name: string, email: string): User => ({
  id: `example-user-${n}`,
  email,
  name,
  avatar: "fox",
  role: "student",
  hasAccess: true,
});

// What a skeleton draws in place of the users, with names and emails of the
// usual length.
export const userExamples: ReadonlyArray<User> = [
  user(1, "Lucía Fernández", "lucia.fernandez@mi.unc.edu.ar"),
  user(2, "Tomás Ríos", "tomas.rios@gmail.com"),
  user(3, "Martina Gómez", "martina.gomez@mi.unc.edu.ar"),
  user(4, "Joaquín Paz", "joaquin.paz@gmail.com"),
];
