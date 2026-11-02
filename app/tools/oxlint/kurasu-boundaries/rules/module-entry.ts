import { existsSync } from "node:fs";
import { dirname, join, relative, resolve, sep } from "node:path";

import { defineRule } from "@oxlint/plugins";

import { importVisitors } from "../../shared/module-sources.ts";

const entry = "index.ts";

const isWithin = (path: string, folder: string): boolean =>
  path === folder || path.startsWith(`${folder}${sep}`);

// The innermost folder that holds an index.ts and contains the target but not the importer.
const enteredModule = (target: string, importer: string): string | null => {
  let folder = dirname(target);

  while (!isWithin(importer, folder)) {
    if (existsSync(join(folder, entry))) {
      return folder;
    }

    const parent = dirname(folder);

    if (parent === folder) {
      return null;
    }

    folder = parent;
  }

  return null;
};

const modulePath = (importer: string, module: string): string => {
  const path = relative(dirname(importer), module).replaceAll(sep, "/");

  return path.startsWith(".") ? path : `./${path}`;
};

/** A folder with an index.ts is a module: code outside it imports only that index.ts. */
export const moduleEntryRule = defineRule({
  meta: {
    type: "problem",
    docs: {
      description: "Import a module folder through its index.ts, never one of its files.",
    },
    messages: {
      partImport:
        "`{{source}}` is a part of the module `{{module}}`. Import from `{{module}}/index.ts` instead.",
    },
  },
  createOnce(context) {
    return importVisitors((node, source) => {
      if (!source.startsWith(".")) {
        return;
      }

      const importer = context.filename;
      const target = resolve(dirname(importer), source);
      const module = enteredModule(target, importer);

      if (module != null && target !== join(module, entry)) {
        context.report({
          node,
          messageId: "partImport",
          data: { source, module: modulePath(importer, module) },
        });
      }
    });
  },
});
