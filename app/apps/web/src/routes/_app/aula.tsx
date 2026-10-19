import { createFileRoute } from "@tanstack/react-router";

const ClassroomRoute = () => <main>ClassroomRoute</main>;

export const Route = createFileRoute("/_app/aula")({ component: ClassroomRoute });
