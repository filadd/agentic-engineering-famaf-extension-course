import type { Material } from "@kurasu/contract/materials";
import type { ReactNode } from "react";

import { materialDetail } from "./material-detail.ts";

interface Props {
  material: Material;
  leading?: ReactNode;
  actions: ReactNode;
}

export const MaterialRow = ({ material, leading, actions }: Props) => (
  <li className="flex items-center gap-2 rounded-xl border-[1.5px] border-sand bg-paper py-2.5 pr-2 pl-3.5 text-coal">
    {leading}
    <div className="min-w-0 flex-1">
      <b className="break-words">{material.name}</b>
      <small className="block text-[13px] text-stone">{materialDetail(material)}</small>
    </div>
    {actions}
  </li>
);
