import type { Material } from "@kurasu/contract/materials";

import { Icon } from "../../ui/Icon.tsx";

interface Props {
  material: Material;
  checking: boolean;
  onMark: (material: Material) => void;
}

export const MarkSlidesButton = ({ material, checking, onMark }: Props) => (
  <button
    type="button"
    title="Usar como slides del aula"
    aria-label={`Usar ${material.name} como slides del aula`}
    disabled={checking}
    onClick={() => onMark(material)}
    className="icon-button text-coal hover:bg-mist"
  >
    <Icon name="presentation" size={16} />
  </button>
);
