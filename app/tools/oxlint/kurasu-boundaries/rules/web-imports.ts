import { defineRule } from "@oxlint/plugins";

import { isInside, moduleSource, type ModuleSourceNode } from "../../shared/module-sources.ts";

const allowedPackages = ["@kurasu/contract", "@kurasu/slides"];

const isAllowed = (source: string): boolean =>
  allowedPackages.some((name) => source === name || source.startsWith(`${name}/`));

const reachesServerCode = (source: string): boolean =>
  (source.startsWith("@kurasu/") && !isAllowed(source)) ||
  (source.startsWith(".") && (isInside(source, "packages") || isInside(source, "apps")));

/** Keeps server code out of the web bundle: the web imports only the contract and the slides protocol. */
export const webImportsRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description:
        "apps/web imports only @kurasu/contract and @kurasu/slides among kurasu's packages.",
    },
    messages: {
      serverImport:
        "`{{source}}` is not available to the web. Import only @kurasu/contract and @kurasu/slides; anything else stays on the server.",
    },
  },
  createOnce(context) {
    const check = (node: ModuleSourceNode) => {
      const source = moduleSource(node);

      if (source != null && reachesServerCode(source)) {
        context.report({ node, messageId: "serverImport", data: { source } });
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
