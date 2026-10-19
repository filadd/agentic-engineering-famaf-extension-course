import { defineRule } from "@oxlint/plugins";

import type { ESTree } from "@oxlint/plugins";

const isNullish = (node: ESTree.Node): boolean =>
  (node.type === "Literal" && node.raw === "null") ||
  (node.type === "Identifier" && node.name === "undefined");

const isUndefined = (node: ESTree.Node): boolean =>
  node.type === "Identifier" && node.name === "undefined";

/** Nullish checks use the loose `== null`, which covers both null and undefined. */
export const nullCheckRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Check for null or undefined with `== null` or `!= null`.",
    },
    messages: {
      strictNullish: "Compare with `{{operator}} null` instead: it covers both null and undefined.",
    },
  },
  createOnce(context) {
    return {
      BinaryExpression(node) {
        const strict = node.operator === "===" || node.operator === "!==";
        const loose = node.operator === "==" || node.operator === "!=";

        if (!strict && !loose) {
          return;
        }

        const flagged = strict
          ? isNullish(node.left) || isNullish(node.right)
          : isUndefined(node.left) || isUndefined(node.right);

        if (flagged) {
          const operator = node.operator.startsWith("!") ? "!=" : "==";
          context.report({ node, messageId: "strictNullish", data: { operator } });
        }
      },
    };
  },
});
