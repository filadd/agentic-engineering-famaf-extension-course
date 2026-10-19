import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";

import { useMe } from "../../features/me/useMe.ts";

const AdminLayout = () => {
  const me = useMe();

  return me.data == null || me.data.role === "teacher" ? <Outlet /> : <Navigate to="/" />;
};

export const Route = createFileRoute("/_app/admin")({ component: AdminLayout });
