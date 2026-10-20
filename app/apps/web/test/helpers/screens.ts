import type { Me } from "@kurasu/contract/user";

import { getJson } from "./api.ts";

// The requests a screen makes as soon as it opens, answered empty, for tests
// that only need to land on it.
export const studentHome = (me: Me) => [
  getJson("/me", me),
  getJson("/sessions", []),
  getJson("/polls", []),
];

export const teacherHome = (me: Me) => [getJson("/me", me), getJson("/admin/sessions", [])];
