import type { Material } from "@kurasu/contract/materials";

import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDeleteMaterial } from "./useDeleteMaterial.ts";

interface Props {
  material: Material;
}

export const DeleteMaterialButton = ({ material }: Props) => {
  const remove = useDeleteMaterial();

  return (
    <ConfirmAction
      renderTrigger={(ask) => (
        <button
          type="button"
          title="Borrar"
          aria-label={`Borrar ${material.name}`}
          onClick={ask}
          className="icon-button text-coal hover:bg-mist"
        >
          <Icon name="trash" size={16} />
        </button>
      )}
      title={`¿Borrar "${material.name}"?`}
      text={
        material.isSlides
          ? "El aula se queda sin slides hasta que subas otras."
          : "Los estudiantes dejan de verlo en el material."
      }
      confirmLabel="Borrar"
      pendingLabel="Borrando…"
      errorText="No se pudo borrar el material. Probá de nuevo."
      onConfirm={() => remove.mutateAsync(material.id)}
    />
  );
};
