import type { Session } from "@kurasu/contract/sessions";

import { Switch } from "../../ui/Switch.tsx";
import { useUpdateSession } from "./useUpdateSession.ts";

interface Props {
  session: Session;
}

export const EnabledSwitch = ({ session }: Props) => {
  const update = useUpdateSession();

  const enabled = session.enabled === true;

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      disabled={update.isPending}
      onClick={() => update.mutate({ id: session.id, change: { enabled: !enabled } })}
      className="mt-4 flex items-center gap-2.5 text-sm"
    >
      <span>{enabled ? "Habilitada" : "Deshabilitada"}</span>
      <Switch on={enabled} />
    </button>
  );
};
