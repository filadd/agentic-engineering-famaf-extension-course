import * as Predicate from "effect/Predicate";
import { useState } from "react";

import { Sheet } from "../../ui/Sheet.tsx";
import { useAddUser } from "./useAddUser.ts";

interface Props {
  onClose: () => void;
}

// Someone added by email gets access at once and goes through the setup the
// first time they enter.
export const AddUserForm = ({ onClose }: Props) => {
  const [email, setEmail] = useState("");

  const add = useAddUser({ onSuccess: onClose });

  return (
    <Sheet open onClose={onClose} title="Agregar por email" width="narrow">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          add.mutate(email.trim());
        }}
      >
        <label className="field-label">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="nombre@mail.com"
            className="input-field"
          />
        </label>
        {add.error == null ? null : (
          <div role="alert" className="mt-3 rounded-[14px] bg-rose px-3.5 py-3 text-sm text-coal">
            {Predicate.isTagged(add.error, "EmailTaken")
              ? "Ese email ya está registrado."
              : "No se pudo agregar. Probá de nuevo."}
          </div>
        )}
        <div className="mt-[18px] flex justify-end gap-2">
          <button type="button" className="pill-button" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="submit"
            className="pill-button pill-dark"
            disabled={!email.includes("@") || add.isPending}
          >
            Agregar
          </button>
        </div>
      </form>
    </Sheet>
  );
};
