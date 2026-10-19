import { defineRule } from "@oxlint/plugins";

const isComponentName = (name: string): boolean => /^[A-Z]/.test(name);

/** React components are arrow functions assigned to a const. */
export const arrowComponentsRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Declare React components as arrow functions.",
    },
    messages: {
      functionComponent: "Declare `{{name}}` as `const {{name}} = (…) => …`.",
    },
  },
  createOnce(context) {
    return {
      FunctionDeclaration(node) {
        if (node.id != null && isComponentName(node.id.name)) {
          context.report({ node, messageId: "functionComponent", data: { name: node.id.name } });
        }
      },
      VariableDeclarator(node) {
        if (
          node.id.type === "Identifier" &&
          isComponentName(node.id.name) &&
          node.init?.type === "FunctionExpression"
        ) {
          context.report({ node, messageId: "functionComponent", data: { name: node.id.name } });
        }
      },
    };
  },
});
