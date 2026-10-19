import { defineRule } from "@oxlint/plugins";

import { importVisitors, isInside, matchesPackage } from "../../shared/module-sources.ts";

const appPackages = ["@kurasu/web", "@kurasu/api", "@kurasu/infra"];

const reachesApp = (source: string): boolean =>
  appPackages.some((name) => matchesPackage(source, name)) ||
  (source.startsWith(".") && isInside(source, "apps"));

/** Keeps the dependency direction: apps compose packages, packages never import apps. */
export const packagesNoAppsRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "packages/* never import apps/*.",
    },
    messages: {
      appImport:
        "`{{source}}` is an app. Packages never import apps; move the shared code into a package.",
    },
  },
  createOnce(context) {
    return importVisitors((node, source) => {
      if (reachesApp(source)) {
        context.report({ node, messageId: "appImport", data: { source } });
      }
    });
  },
});
