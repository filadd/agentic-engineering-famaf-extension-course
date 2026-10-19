import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Fragment, StrictMode } from "react";

import { getRouter } from "../../src/router.tsx";
import { Route as rootRoute } from "../../src/routes/__root.tsx";

interface Options {
  strict?: boolean;
}

export const renderRoute = async (url: string, options: Options = {}) => {
  const router = getRouter();

  // Testing Library renders into a div, so the document shell (html, head and
  // body) stays out and the routes render straight into it.
  Object.assign(rootRoute.options, { shellComponent: Fragment });
  router.update({ ...router.options, history: createMemoryHistory({ initialEntries: [url] }) });
  const app = <RouterProvider router={router} />;
  const user = userEvent.setup();

  render(options.strict === true ? <StrictMode>{app}</StrictMode> : app);

  return { router, user };
};
