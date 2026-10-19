import { createRouter } from "@tanstack/react-router";

import { createQueryClient } from "./api/create-query-client.ts";
import { routeTree } from "./routeTree.gen.ts";
import { ErrorScreen } from "./ui/ErrorScreen.tsx";

export const getRouter = () => {
  const queryClient = createQueryClient(() => {
    void router.navigate({ to: "/login" }).then(() => queryClient.clear());
  });

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultErrorComponent: ErrorScreen,
  });

  return router;
};

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
