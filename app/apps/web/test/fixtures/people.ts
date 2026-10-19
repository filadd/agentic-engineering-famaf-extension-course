import type { Me, User } from "@kurasu/contract/user";

import { ulid } from "./ids.ts";

export const student: Me = {
  id: ulid("S", 1),
  email: "lucia.fernandez@mi.unc.edu.ar",
  name: "Lucía",
  avatar: "fox",
  role: "student",
};

export const otherStudent: Me = {
  id: ulid("S", 2),
  email: "tomas.rios@gmail.com",
  name: "Tomás",
  avatar: "panda",
  role: "student",
};

export const teacher: Me = {
  id: ulid("T", 1),
  email: "profe@kurasu.test",
  name: "Agustín",
  avatar: "owl",
  role: "teacher",
};

export const newcomer: Me = {
  id: ulid("S", 9),
  email: "nueva@gmail.com",
  name: null,
  avatar: null,
  role: "student",
};

export const userOf = (me: Me, hasAccess = true): User => ({ ...me, hasAccess });
