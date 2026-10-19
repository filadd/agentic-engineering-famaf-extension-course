import type { User } from "@kurasu/contract/user";

import { ConfirmAction } from "../../ui/ConfirmAction.tsx";
import { Switch } from "../../ui/Switch.tsx";
import { animalLooks } from "../me/animals.ts";
import { useSetAccess } from "./useSetAccess.ts";

interface Props {
  user: User;
}

// Giving access is immediate; taking it away asks first. The teacher's own
// row has no switch.
export const UserRow = ({ user }: Props) => {
  const setAccess = useSetAccess();

  return (
    <li
      aria-label={user.name ?? user.email}
      className="flex items-center gap-3 rounded-2xl bg-side py-2.5 pr-3 pl-3.5"
    >
      {user.avatar == null ? (
        <span
          aria-hidden="true"
          className="grid size-[38px] flex-none place-items-center rounded-full border-2 border-dashed border-muted text-muted"
        >
          ?
        </span>
      ) : (
        <span
          aria-hidden="true"
          className="grid size-[38px] flex-none place-items-center rounded-full bg-lilac text-xl"
        >
          {animalLooks[user.avatar].emoji}
        </span>
      )}
      <div className="min-w-0 flex-1">
        {user.name == null ? <span className="text-muted">Sin nombre</span> : <b>{user.name}</b>}
        {user.role === "teacher" ? (
          <span className="ml-1.5 rounded-full bg-window px-2 py-px text-[11px] text-muted">
            Profe
          </span>
        ) : null}
        <small className="block text-[13px] text-muted">{user.email}</small>
      </div>
      {user.role === "teacher" ? null : (
        <ConfirmAction
          renderTrigger={(ask) => (
            <button
              type="button"
              role="switch"
              aria-checked={user.hasAccess}
              aria-label={user.hasAccess ? "Con acceso" : "Sin acceso"}
              disabled={setAccess.isPending}
              onClick={() =>
                user.hasAccess ? ask() : setAccess.mutate({ id: user.id, hasAccess: true })
              }
              className="flex items-center gap-2 text-[13px]"
            >
              {user.hasAccess ? "Con acceso" : "Sin acceso"}
              <Switch on={user.hasAccess} />
            </button>
          )}
          title={`¿Sacarle el acceso a ${user.name ?? user.email}?`}
          text="No va a poder entrar al aula hasta que le vuelvas a dar acceso."
          confirmLabel="Sacar acceso"
          pendingLabel="Sacando…"
          errorText="No se pudo sacar el acceso. Probá de nuevo."
          onConfirm={() => setAccess.mutateAsync({ id: user.id, hasAccess: false })}
        />
      )}
    </li>
  );
};
