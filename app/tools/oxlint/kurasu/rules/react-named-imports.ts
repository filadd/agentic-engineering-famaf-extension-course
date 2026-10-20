import { defineRule } from "@oxlint/plugins";

/** React internals are imported by name, never through the default or namespace import. */
export const reactNamedImportsRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Import React APIs by name.",
    },
    messages: {
      reactImport: 'Import what you use by name: `import { useState } from "react"`.',
    },
  },
  createOnce(context) {
    return {
      ImportDeclaration(node) {
        if (node.source.value !== "react") {
          return;
        }

        for (const specifier of node.specifiers) {
          if (
            specifier.type === "ImportDefaultSpecifier" ||
            specifier.type === "ImportNamespaceSpecifier"
          ) {
            context.report({ node: specifier, messageId: "reactImport" });
          }
        }
      },
    };
  },
});
