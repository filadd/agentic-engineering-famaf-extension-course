import * as Predicate from "effect/Predicate";
import * as Schema from "effect/Schema";
import { useId } from "react";
import { revalidateLogic, useForm } from "@tanstack/react-form";

import { Email } from "@kurasu/contract/user";

import { Button } from "../../ui/Button.tsx";
import { FieldError } from "../../ui/FieldError.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { useAddUser } from "./useAddUser.ts";

interface Props {
  onClose: () => void;
}

const emailFormSchema = Schema.toStandardSchemaV1(Schema.Struct({ email: Email }));

// Someone added by email gets access at once and goes through the setup the
// first time they enter.
export const AddUserForm = ({ onClose }: Props) => {
  const errorId = useId();

  const add = useAddUser({ onSuccess: onClose });

  const form = useForm({
    defaultValues: { email: "" },
    validationLogic: revalidateLogic(),
    canSubmitWhenInvalid: true,
    validators: { onDynamic: emailFormSchema },
    onSubmit: ({ value }) => {
      add.mutate(Schema.decodeSync(Email)(value.email));
    },
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
              <label className="field-label">
                Email
                <input
                  type="text"
                  inputMode="email"
                  autoComplete="off"
                  value={field.state.value}
                  onChange={(event) => field.handleChange(event.target.value)}
                  onBlur={field.handleBlur}
                  placeholder="nombre@mail.com"
                  className="input-field"
                  aria-invalid={field.state.meta.errors.length > 0}
                  aria-describedby={errorId}
                />
              </label>
              <FieldError id={errorId} error={field.state.meta.errors[0]?.message ?? null} />
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
