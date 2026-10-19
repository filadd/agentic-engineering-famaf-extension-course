import * as Predicate from "effect/Predicate";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
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
          <InlineError className="mt-3">
            {Predicate.isTagged(add.error, "EmailTaken")
              ? "Ese email ya está registrado."
              : "No se pudo agregar. Probá de nuevo."}
          </InlineError>
        )}
        <div className="mt-[18px] flex justify-end gap-2">
          <Button variant="pill" disabled={add.isPending} onClick={onClose}>
            Cancelar
          </Button>
          <Button
            variant="pill-dark"
            type="submit"
            disabled={!email.includes("@")}
            pending={add.isPending}
            pendingLabel="Agregando…"
          >
            Agregar
          </Button>
        </div>
      </form>
    </Sheet>
  );
};
