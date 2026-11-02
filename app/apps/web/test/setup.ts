import { cleanup, configure } from "@testing-library/react";
import { toast } from "sonner";
import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./helpers/server.ts";

// A screen's requests go one after another (me, sessions, session, materials,
// the slides file) and each waits for the previous render. Under the load of
// turbo running the web and API suites together, that chain takes more than the
// 1 s that findBy* and waitFor wait by default.
configure({ asyncUtilTimeout: 4000 });

beforeAll(() => server.listen({ onUnhandledFrame: "error" }));

afterEach(() => {
  // sonner keeps its toasts in module state, outside the rendered tree, so a
  // toast from one test would show up in the next one.
  toast.dismiss();
  cleanup();
  server.resetHandlers();
  localStorage.clear();
  document.documentElement.className = "";
});

afterAll(() => server.close());
