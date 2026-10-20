import { defineRule } from "@oxlint/plugins";
import * as Schema from "effect/Schema";

import { resolveVariable } from "../../anti-slop/shared/scope.ts";

import type { ESTree, SourceCode } from "@oxlint/plugins";

const queryHooks = new Set(["useQuery", "useSuspenseQuery", "useInfiniteQuery", "useMutation"]);

const Options = Schema.Struct({
  sources: Schema.optional(Schema.Array(Schema.String)),
  allow: Schema.optional(Schema.Array(Schema.String)),
});

const importSource = (
  sourceCode: SourceCode,
  callee: ESTree.IdentifierReference,
): string | null => {
  const variable = resolveVariable(sourceCode, callee);
  const definition = variable?.defs[0];

  if (definition?.type !== "ImportBinding" || definition.parent?.type !== "ImportDeclaration") {
    return null;
  }

  return definition.parent.source.value;
};

/**
 * Queries and mutations stay whole (`polls.data`, `vote.mutate`), so a reader sees which
 * request a value belongs to. Covers TanStack's hooks and the API hooks imported from the
 * configured `sources`.
 */
export const noDestructuredQueryRule = defineRule({
  meta: {
    type: "suggestion",
    docs: {
      description: "Do not destructure the result of a query or mutation hook.",
    },
    messages: {
      destructured:
        "Keep the result of `{{hook}}` whole: `const x = {{hook}}(…)` and read `x.data`.",
    },
    schema: [
      {
        type: "object",
        properties: {
          sources: { type: "array", items: { type: "string" } },
          allow: { type: "array", items: { type: "string" } },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const options = Schema.decodeUnknownSync(Options)(context.options[0] ?? {});
    const sources = options.sources ?? [];
    const allow = new Set(options.allow ?? []);

    const isQueryHook = (callee: ESTree.IdentifierReference): boolean => {
      if (queryHooks.has(callee.name)) {
        return true;
      }

      if (!/^use[A-Z]/.test(callee.name) || allow.has(callee.name)) {
        return false;
      }

      const source = importSource(context.sourceCode, callee);

      return source != null && sources.some((fragment) => source.includes(fragment));
    };

    return {
      VariableDeclarator(node) {
        if (
          node.id.type === "ObjectPattern" &&
          node.init?.type === "CallExpression" &&
          node.init.callee.type === "Identifier" &&
          isQueryHook(node.init.callee)
        ) {
          context.report({
            node: node.id,
            messageId: "destructured",
            data: { hook: node.init.callee.name },
          });
        }
      },
    };
  },
});
