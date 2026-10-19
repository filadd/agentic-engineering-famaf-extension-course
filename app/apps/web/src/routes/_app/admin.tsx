import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/admin")({
  beforeLoad: ({ context }) => {
    if (context.me.role !== "teacher") {
      throw redirect({ to: "/" });
    }
  },
  component: Outlet,
});
