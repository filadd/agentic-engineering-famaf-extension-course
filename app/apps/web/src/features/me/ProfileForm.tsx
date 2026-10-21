import type { ProfileInput } from "@kurasu/contract/me";
import type { Animal, Me } from "@kurasu/contract/user";
import { useState } from "react";
import type { ReactNode } from "react";

import { InlineError } from "../../ui/InlineError.tsx";
import { AvatarPicker } from "./AvatarPicker.tsx";

export interface ProfileDraft {
  name: string;
  avatar: Animal | null;
  canSave: boolean;
  saving: boolean;
}

interface Props {
  me: Me;
  onSave: (profile: ProfileInput) => void;
  isSaving: boolean;
  isError: boolean;
  nameLabel: string;
  namePlaceholder?: string;
  renderActions: (draft: ProfileDraft) => ReactNode;
}

export const ProfileForm = ({
  me,
  onSave,
  isSaving,
  isError,
  nameLabel,
  namePlaceholder,
  renderActions,
}: Props) => {
  const [name, setName] = useState(me.name ?? "");
  const [avatar, setAvatar] = useState(me.avatar);

  const canSave = name.trim() !== "" && avatar != null;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();

        if (canSave) {
          onSave({ name: name.trim(), avatar });
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
      {isError ? (
        <InlineError className="mt-4">No se pudo guardar tu perfil. Probá de nuevo.</InlineError>
      ) : null}
      {renderActions({ name, avatar, canSave, saving: isSaving })}
    </form>
  );
};
