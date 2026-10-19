import type { Material } from "@kurasu/contract/materials";
import { useState } from "react";

import { ConfirmDialog } from "../../ui/ConfirmDialog.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useDeleteMaterial } from "./useDeleteMaterial.ts";

interface Props {
  material: Material;
}

export const DeleteMaterialButton = ({ material }: Props) => {
  const [confirming, setConfirming] = useState(false);

  const remove = useDeleteMaterial({ onSuccess: () => setConfirming(false) });

  return (
    <>
      <button
        type="button"
        title="Borrar"
        aria-label={`Borrar ${material.name}`}
        onClick={() => setConfirming(true)}
        className="icon-button text-coal hover:bg-mist"
      >
        <Icon name="trash" size={16} />
      </button>
      <ConfirmDialog
        open={confirming}
        title={`¿Borrar "${material.name}"?`}
        text={
          material.isSlides
            ? "El aula se queda sin slides hasta que subas otras."
            : "Los estudiantes dejan de verlo en el material."
        }
        confirmLabel="Borrar"
        onConfirm={() => remove.mutate(material.id)}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
};
