import { createFileRoute } from "@tanstack/react-router";

const PresentRoute = () => <main>PresentRoute</main>;

export const Route = createFileRoute("/_app/admin/presentar/$id")({ component: PresentRoute });
