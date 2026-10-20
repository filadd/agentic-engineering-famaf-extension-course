import type { User } from "@kurasu/contract/user";
import * as Schema from "effect/Schema";
import { http, HttpResponse } from "msw";

import { ulid } from "../fixtures/ids.ts";
import { apiError, readJson, url } from "./api.ts";

// The teacher's users endpoints and the enrollment code over in-memory state.
export const userStore = (initial: ReadonlyArray<User>) => {
  let users = [...initial];
  let code = "K7F2Q";
  const writes: Array<{ method: string; body: unknown }> = [];

  const enrollment = () => ({ code, url: `http://localhost:5173/registro?codigo=${code}` });

  const handlers = [
    http.get(url("/admin/users"), () => HttpResponse.json(users)),
    http.post(url("/admin/users"), async ({ request }) => {
      const { email } = await readJson(request, Schema.Struct({ email: Schema.String }));

      writes.push({ method: "POST", body: email });

      if (users.some((user) => user.email === email)) {
        return apiError("EmailTaken");
      }

      const added: User = {
        id: ulid("S", 300 + users.length),
        email,
        name: null,
        avatar: null,
        role: "student",
        hasAccess: true,
      };

      users = [...users, added];

      return HttpResponse.json(added, { status: 201 });
    }),
    http.patch(url("/admin/users/:id"), async ({ params, request }) => {
      const { hasAccess } = await readJson(request, Schema.Struct({ hasAccess: Schema.Boolean }));

      writes.push({ method: "PATCH", body: { id: params["id"], hasAccess } });
      users = users.map((user) => (user.id === params["id"] ? { ...user, hasAccess } : user));

      return HttpResponse.json(users.find((user) => user.id === params["id"]));
    }),
    http.get(url("/admin/enrollment-code"), () => HttpResponse.json(enrollment())),
    http.post(url("/admin/enrollment-code"), () => {
      writes.push({ method: "POST", body: "enrollment-code" });
      code = "Q9ZR3";

      return HttpResponse.json(enrollment());
    }),
  ];

  return { handlers, writes };
};
