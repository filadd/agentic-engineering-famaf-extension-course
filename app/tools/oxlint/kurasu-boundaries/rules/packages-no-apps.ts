import { defineRule } from "@oxlint/plugins";

import { isInside, moduleSource, type ModuleSourceNode } from "../../shared/module-sources.ts";

const appPackages = ["@kurasu/web", "@kurasu/api", "@kurasu/infra"];

const reachesApp = (source: string): boolean =>
  appPackages.some((name) => source === name || source.startsWith(`${name}/`)) ||
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
    const check = (node: ModuleSourceNode) => {
      const source = moduleSource(node);

      if (source != null && reachesApp(source)) {
        context.report({ node, messageId: "appImport", data: { source } });
      }
    };

    return {
      ImportDeclaration: check,
      ExportNamedDeclaration: check,
      ExportAllDeclaration: check,
      ImportExpression: check,
    };
  },
});
