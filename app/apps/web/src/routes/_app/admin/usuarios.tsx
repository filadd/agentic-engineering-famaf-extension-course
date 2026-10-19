import { createFileRoute } from "@tanstack/react-router";

const UsersRoute = () => <main>UsersRoute</main>;

export const Route = createFileRoute("/_app/admin/usuarios")({ component: UsersRoute });
