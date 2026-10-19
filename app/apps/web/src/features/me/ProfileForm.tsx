import type { Animal, Me } from "@kurasu/contract/user";
import { useState } from "react";
import type { ReactNode } from "react";

import { InlineError } from "../../ui/InlineError.tsx";
import { AvatarPicker } from "./AvatarPicker.tsx";
import { useUpdateProfile } from "./useUpdateProfile.ts";

export interface ProfileDraft {
  name: string;
  avatar: Animal | null;
  canSave: boolean;
  saving: boolean;
}

interface Props {
  me: Me;
  onSaved?: (me: Me) => void;
  nameLabel: string;
  namePlaceholder?: string;
  renderActions: (draft: ProfileDraft) => ReactNode;
}

export const ProfileForm = ({ me, onSaved, nameLabel, namePlaceholder, renderActions }: Props) => {
  const [name, setName] = useState(me.name ?? "");
  const [avatar, setAvatar] = useState(me.avatar);

  const save = useUpdateProfile({ onSuccess: (saved) => onSaved?.(saved) });

  const canSave = name.trim() !== "" && avatar != null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (canSave) {
          save.mutate({ name: name.trim(), avatar });
        }
      }}
    >
      <label className="field-label">
        {nameLabel}
        <input
          value={name}
          maxLength={40}
          onChange={(event) => setName(event.target.value)}
          placeholder={namePlaceholder}
          className="input-field"
        />
      </label>
      <div className="mt-5 text-sm font-bold">Tu avatar</div>
      <AvatarPicker value={avatar} onChange={setAvatar} />
      {save.isError ? (
        <InlineError className="mt-4">No se pudo guardar tu perfil. Probá de nuevo.</InlineError>
      ) : null}
      {renderActions({ name, avatar, canSave, saving: save.isPending })}
    </form>
  );
};
