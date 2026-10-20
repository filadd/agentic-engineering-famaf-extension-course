import type { Material } from "@kurasu/contract/materials";

import { Icon } from "../../ui/Icon.tsx";

interface Props {
  material: Material;
}

export const DownloadButton = ({ material }: Props) => (
  <a
    href={`/api/materials/${material.id}/file`}
    download={material.name}
    title="Descargar"
    aria-label={`Descargar ${material.name}`}
    className="icon-button text-coal hover:bg-mist"
  >
    <Icon name="download" size={18} />
  </a>
);
