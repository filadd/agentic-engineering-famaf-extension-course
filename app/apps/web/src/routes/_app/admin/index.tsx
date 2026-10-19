import { createFileRoute } from "@tanstack/react-router";

const AdminHomeRoute = () => <main>AdminHomeRoute</main>;

export const Route = createFileRoute("/_app/admin/")({ component: AdminHomeRoute });
