import { defineRule } from "@oxlint/plugins";

/** Conditional rendering in JSX uses a ternary, never `&&`. */
export const ternaryRenderRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Render conditionally with a ternary instead of `&&`.",
    },
    messages: {
      logicalRender: "Render conditionally with `condition ? <A /> : null` instead of `&&`.",
    },
  },
  createOnce(context) {
    return {
      JSXExpressionContainer(node) {
        if (node.expression.type === "LogicalExpression" && node.expression.operator === "&&") {
          context.report({ node, messageId: "logicalRender" });
        }
      },
    };
  },
});
