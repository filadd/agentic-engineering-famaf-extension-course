import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

import { isAccessError } from "../api/access-error.ts";
import { meQuery } from "../features/me/me-query.ts";

export const Route = createFileRoute("/_app")({
  beforeLoad: async ({ context, location }) => {
    const me = await context.queryClient.ensureQueryData(meQuery()).catch((error: Error) => {
      throw isAccessError(error) ? redirect({ to: "/login" }) : error;
    });

    if ((me.name == null || me.avatar == null) && location.pathname !== "/setup") {
      throw redirect({ to: "/setup" });
    }

    return { me };
  },
  component: Outlet,
});
