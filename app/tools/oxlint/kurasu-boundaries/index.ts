import { eslintCompatPlugin } from "@oxlint/plugins";

import { coreNoAdaptersRule } from "./rules/core-no-adapters.ts";
import { packagesNoAppsRule } from "./rules/packages-no-apps.ts";
import { webImportsRule } from "./rules/web-imports.ts";

/** Import boundaries between kurasu's apps and packages; .oxlintrc.json scopes each rule to its folder. */
const kurasuBoundariesPlugin = eslintCompatPlugin({
  meta: { name: "kurasu-boundaries" },
  rules: {
    "web-imports": webImportsRule,
    "core-no-adapters": coreNoAdaptersRule,
    "packages-no-apps": packagesNoAppsRule,
  },
});

export default kurasuBoundariesPlugin;
