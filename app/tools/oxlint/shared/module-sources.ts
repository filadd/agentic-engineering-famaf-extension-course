import type { ESTree } from "@oxlint/plugins";

export type ModuleSourceNode =
  | ESTree.ImportDeclaration
  | ESTree.ExportNamedDeclaration
  | ESTree.ExportAllDeclaration
  | ESTree.ImportExpression;

/** Returns the literal module specifier of an import, re-export or dynamic import. */
export const moduleSource = (node: ModuleSourceNode): string | null => {
  const source = node.source;

  if (source == null || source.type !== "Literal" || source.value == null) {
    return null;
  }

  return String(source.value);
};

/** Reports whether a path, absolute or relative, lies inside the given app folder. */
export const isInside = (path: string, folder: string): boolean =>
  path.replaceAll("\\", "/").includes(`/${folder}/`);

export const matchesPackage = (source: string, name: string): boolean =>
  source === name || source.startsWith(`${name}/`);

/** Calls `check` with the literal specifier of every import, re-export and dynamic import. */
export const importVisitors = (check: (node: ModuleSourceNode, source: string) => void) => {
  const visit = (node: ModuleSourceNode) => {
    const source = moduleSource(node);

    if (source != null) {
      check(node, source);
    }
  };

  return {
    ImportDeclaration: visit,
    ExportNamedDeclaration: visit,
    ExportAllDeclaration: visit,
    ImportExpression: visit,
  };
};
