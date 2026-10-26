import * as Predicate from "effect/Predicate";

import { Button } from "../../ui/Button.tsx";
import { Field } from "../../ui/Field.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { useEmailForm } from "../../helpers/useEmailForm.ts";
import { useAddUser } from "./useAddUser.ts";

interface Props {
  onClose: () => void;
}

// Someone added by email gets access at once and goes through the setup the
// first time they enter.
export const AddUserForm = ({ onClose }: Props) => {
  const add = useAddUser({ onSuccess: onClose });

  const { form } = useEmailForm({
    initialEmail: "",
    onValidEmail: (email) => add.mutate(email),
  });

  return (
    <Sheet open onClose={onClose} title="Agregar por email" width="narrow" pending={add.isPending}>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void form.handleSubmit();
        }}
        noValidate
      >
        <form.Field name="email">
          {(field) => (
            <>
              <Field
                label="Email"
                type="text"
                inputMode="email"
                autoComplete="off"
                placeholder="nombre@mail.com"
                value={field.state.value}
                onChange={field.handleChange}
                onBlur={field.handleBlur}
                aria-invalid={field.state.meta.errors.length > 0}
                error={field.state.meta.errors[0]?.message ?? null}
              />
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
                  disabled={field.state.value.trim() === ""}
                  pending={add.isPending}
                  pendingLabel="Agregando…"
                >
                  Agregar
                </Button>
              </div>
            </>
          )}
        </form.Field>
      </form>
    </Sheet>
  );
};
