import { cleanup } from "@testing-library/react";
import { toast } from "sonner";
import { afterAll, afterEach, beforeAll } from "vitest";

import { server } from "./helpers/server.ts";

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
