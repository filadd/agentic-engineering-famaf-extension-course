import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router";

import { useThemeClass } from "../helpers/local-ui/useThemeClass.ts";
import styles from "../styles.css?url";
import { RootDocument } from "../ui/RootDocument.tsx";
import { Toaster } from "../ui/Toaster.tsx";

// The crow emoji drawn as the tab's icon, so the brand needs no image file.
const favicon = `data:image/svg+xml,${encodeURIComponent(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🐦‍⬛</text></svg>',
)}`;

export interface RouterContext {
  queryClient: QueryClient;
}

const RootLayout = () => {
  const { queryClient } = Route.useRouteContext();

  useThemeClass();

  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster />
    </QueryClientProvider>
  );
};

export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Kurasu" },
    ],
    links: [
      { rel: "icon", href: favicon },
      { rel: "stylesheet", href: styles },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Rubik:wght@400;500;700&family=Atkinson+Hyperlegible:wght@400;700&display=swap",
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootLayout,
});
