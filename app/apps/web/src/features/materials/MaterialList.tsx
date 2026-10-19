import type { Material } from "@kurasu/contract/materials";
import type { ReactNode } from "react";

import { MaterialRow } from "./MaterialRow.tsx";

interface Props {
  materials: ReadonlyArray<Material>;
  toolbar?: ReactNode;
  renderLeading?: (material: Material) => ReactNode;
  renderActions: (material: Material) => ReactNode;
}

export const MaterialList = ({ materials, toolbar, renderLeading, renderActions }: Props) => (
  <div>
    {toolbar}
    {materials.length === 0 ? (
      <div className="py-1.5 text-sm text-muted">Todavía no hay material.</div>
    ) : (
      <ul aria-label="Material" className="mt-1.5 flex flex-col gap-2">
        {materials.map((material) => (
          <MaterialRow
            key={material.id}
            material={material}
            leading={renderLeading?.(material)}
            actions={renderActions(material)}
          />
        ))}
      </ul>
    )}
  </div>
);
