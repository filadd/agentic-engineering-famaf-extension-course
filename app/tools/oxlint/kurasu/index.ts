import { eslintCompatPlugin } from "@oxlint/plugins";

import { arrowComponentsRule } from "./rules/arrow-components.ts";
import { noDestructuredQueryRule } from "./rules/no-destructured-query.ts";
import { noEnumRule } from "./rules/no-enum.ts";
import { nullCheckRule } from "./rules/null-check.ts";
import { propsNameRule } from "./rules/props-name.ts";
import { reactNamedImportsRule } from "./rules/react-named-imports.ts";
import { ternaryRenderRule } from "./rules/ternary-render.ts";
import { testLocationRule } from "./rules/test-location.ts";

/** kurasu's TypeScript, React and test conventions that oxlint does not ship. */
const kurasuPlugin = eslintCompatPlugin({
  meta: { name: "kurasu" },
  rules: {
    "null-check": nullCheckRule,
    "no-enum": noEnumRule,
    "arrow-components": arrowComponentsRule,
    "props-name": propsNameRule,
    "react-named-imports": reactNamedImportsRule,
    "ternary-render": ternaryRenderRule,
    "no-destructured-query": noDestructuredQueryRule,
    "test-location": testLocationRule,
  },
});

export default kurasuPlugin;
