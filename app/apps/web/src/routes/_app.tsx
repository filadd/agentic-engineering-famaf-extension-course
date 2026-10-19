import { createFileRoute, Navigate, Outlet, useLocation } from "@tanstack/react-router";

import { useMe } from "../features/me/useMe.ts";

// The login check does not hold the page: it draws with its skeletons while
// /api/me answers. Without a session, the query client sends to the login.
const AppLayout = () => {
  const me = useMe();
  const location = useLocation();

  const incomplete = me.data != null && (me.data.name == null || me.data.avatar == null);

  return incomplete && location.pathname !== "/setup" ? <Navigate to="/setup" /> : <Outlet />;
};

export const Route = createFileRoute("/_app")({ component: AppLayout });
