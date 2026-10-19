import type { Me } from "@kurasu/contract/user";
import { useIsMutating } from "@tanstack/react-query";

import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { ProfileForm } from "./ProfileForm.tsx";
import { updateProfileKey } from "./useUpdateProfile.ts";

interface Props {
  me: Me;
  open: boolean;
  onClose: () => void;
}

// The form owns the save, so the sheet reads it from the mutation cache to know
// whether it waits.
export const ProfileDialog = ({ me, open, onClose }: Props) => {
  const saving = useIsMutating({ mutationKey: updateProfileKey }) > 0;

  return (
    <Sheet open={open} onClose={onClose} title="Tu perfil" width="normal" pending={saving}>
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
            <Button variant="pill" disabled={draft.saving} onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="pill-dark"
              type="submit"
              disabled={!draft.canSave}
              pending={draft.saving}
              pendingLabel="Guardando…"
            >
              <Icon name="check" size={16} />
              Guardar
            </Button>
          </div>
        )}
      />
    </Sheet>
  );
};
