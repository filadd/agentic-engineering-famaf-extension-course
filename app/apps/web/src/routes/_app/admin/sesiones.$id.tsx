import { createFileRoute } from "@tanstack/react-router";

const AdminSessionRoute = () => <main>AdminSessionRoute</main>;

export const Route = createFileRoute("/_app/admin/sesiones/$id")({ component: AdminSessionRoute });
