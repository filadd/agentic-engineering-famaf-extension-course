import { defineRule } from "@oxlint/plugins";

/** TypeScript enums are replaced by a const map and a type derived from it. */
export const noEnumRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Disallow TypeScript enums.",
    },
    messages: {
      enum: "Replace the enum with a const map (`as const`) and derive its type from the map.",
    },
  },
  createOnce(context) {
    return {
      TSEnumDeclaration(node) {
        context.report({ node, messageId: "enum" });
      },
    };
  },
});
