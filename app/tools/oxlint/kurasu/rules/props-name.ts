import { defineRule } from "@oxlint/plugins";

import type { ESTree } from "@oxlint/plugins";

/** A component's props type is always called `Props`. */
export const propsNameRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Name a component's props interface `Props`.",
    },
    messages: {
      propsName:
        "Rename `{{name}}` to `Props`: each component file declares its own props as `Props`.",
    },
  },
  createOnce(context) {
    const check = (node: ESTree.TSInterfaceDeclaration | ESTree.TSTypeAliasDeclaration) => {
      const name = node.id.name;

      if (name.endsWith("Props") && name !== "Props") {
        context.report({ node: node.id, messageId: "propsName", data: { name } });
      }
    };

    return {
      TSInterfaceDeclaration: check,
      TSTypeAliasDeclaration: check,
    };
  },
});
