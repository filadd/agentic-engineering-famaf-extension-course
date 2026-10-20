import type { Animal } from "@kurasu/contract/user";

import { Avatar } from "./Avatar.tsx";

interface Props {
  name: string;
  avatar: Animal | null;
}

export const ProfilePreview = ({ name, avatar }: Props) => (
  <div className="mt-[18px] flex items-center gap-2.5 rounded-[14px] bg-side px-3.5 py-3 text-sm">
    <Avatar animal={avatar} size="small" />
    <b>{name.trim() === "" ? "Tu nombre" : name}</b>
    <span className="ml-auto text-xs text-muted max-[600px]:hidden">Así te ven los demás</span>
  </div>
);
