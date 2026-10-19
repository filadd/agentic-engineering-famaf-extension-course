import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { Avatar } from "./Avatar.tsx";
import { LogoutButton } from "./LogoutButton.tsx";
import { meExample } from "./me-example.ts";
import { ProfileDialog } from "./ProfileDialog.tsx";
import { ThemeSwitch } from "./ThemeSwitch.tsx";
import { useMe } from "./useMe.ts";

export const UserMenu = () => {
  const me = useMe();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);

  return me.data == null ? (
    <SkeletonOf>
      <Avatar animal={meExample.avatar} size="large" />
    </SkeletonOf>
  ) : (
    <div className="relative">
      <button
        type="button"
        title="Tu cuenta"
        aria-label="Tu cuenta"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="rounded-full p-0"
      >
        <Avatar animal={me.data.avatar} size="large" />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute top-[58px] right-0 z-30 w-[290px] rounded-[18px] border-[1.5px] border-line bg-window p-3.5 shadow-xl max-[600px]:top-[52px]"
        >
          <div className="flex items-center gap-2.5">
            <Avatar animal={me.data.avatar} />
            <div className="min-w-0">
              <div className="font-display font-bold">{me.data.name}</div>
              <div className="mt-0.5 text-sm [overflow-wrap:anywhere] text-muted">
                {me.data.email}
              </div>
            </div>
          </div>
          <hr className="my-3 border-0 border-t-[1.5px] border-line" />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setEditing(true);
            }}
            className="flex w-full items-center gap-2.5 rounded-[10px] px-1.5 py-2 text-left text-ink hover:bg-line max-[600px]:py-[11px]"
          >
            <Icon name="pencil" size={18} />
            Editar perfil
          </button>
          <ThemeSwitch />
          <hr className="my-3 border-0 border-t-[1.5px] border-line" />
          <LogoutButton />
        </div>
      ) : null}
      {editing ? (
        <ProfileDialog me={me.data} open={editing} onClose={() => setEditing(false)} />
      ) : null}
    </div>
  );
};
