import type { Me } from "@kurasu/contract/user";

import { Icon } from "../../ui/Icon.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { ProfileForm } from "./ProfileForm.tsx";

interface Props {
  me: Me;
  open: boolean;
  onClose: () => void;
}

export const ProfileDialog = ({ me, open, onClose }: Props) => (
  <Sheet open={open} onClose={onClose} title="Tu perfil" width="normal">
    <div className="flex items-center gap-2 text-sm break-all text-muted">
      <Icon name="lock" size={14} />
      {me.email}
    </div>
    <ProfileForm
      me={me}
      nameLabel="Nombre"
      onSaved={onClose}
      renderActions={(draft) => (
        <div className="mt-3.5 flex justify-end gap-2">
          <button type="button" className="pill-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="pill-button pill-dark"
            disabled={!draft.canSave || draft.saving}
          >
            <Icon name="check" size={16} />
            Guardar
          </button>
        </div>
      )}
    />
  </Sheet>
);
