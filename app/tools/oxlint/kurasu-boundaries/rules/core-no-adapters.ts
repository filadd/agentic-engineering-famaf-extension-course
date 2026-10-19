import { defineRule } from "@oxlint/plugins";

import { moduleSource, type ModuleSourceNode } from "../../shared/module-sources.ts";

const adapterSources = [
  "cloudflare:",
  "alchemy",
  "drizzle-orm",
  "jose",
  "@cloudflare/",
  "@effect/sql-d1",
];

const isAdapterSource = (source: string): boolean =>
  adapterSources.some(
    (prefix) =>
      source === prefix ||
      source.startsWith(prefix.endsWith(":") || prefix.endsWith("/") ? prefix : `${prefix}/`),
  );

/** Keeps packages/core free of platform code: core declares ports, adapters live elsewhere. */
export const coreNoAdaptersRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "packages/core does not import Cloudflare, Alchemy, Drizzle or jose.",
    },
    messages: {
      adapterImport:
        "`{{source}}` is an adapter dependency. Declare a port in core and implement it in packages/database or apps/api.",
    },
  },
  createOnce(context) {
    const check = (node: ModuleSourceNode) => {
      const source = moduleSource(node);

      if (source != null && isAdapterSource(source)) {
        context.report({ node, messageId: "adapterImport", data: { source } });
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
