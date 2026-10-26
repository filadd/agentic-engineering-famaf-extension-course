import { useId } from "react";
import * as Schema from "effect/Schema";
import { revalidateLogic, useForm } from "@tanstack/react-form";

import { Email } from "@kurasu/contract/user";

import { Button } from "../../ui/Button.tsx";
import { FieldError } from "../../ui/FieldError.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { AuthNotice } from "./AuthNotice.tsx";
import { linkNotices } from "./link-notices.ts";
import type { LinkNotice } from "./link-notices.ts";

interface Props {
  title: string;
  initialEmail: string;
  notice: LinkNotice | null;
  sending: boolean;
  onSubmit: (email: string) => void;
}

const emailFormSchema = Schema.toStandardSchemaV1(Schema.Struct({ email: Email }));

export const EmailStep = ({ title, initialEmail, notice, sending, onSubmit }: Props) => {
  const errorId = useId();

  const form = useForm({
    defaultValues: { email: initialEmail },
    validationLogic: revalidateLogic(),
    canSubmitWhenInvalid: true,
    validators: { onDynamic: emailFormSchema },
    onSubmit: ({ value }) => {
      onSubmit(Schema.decodeSync(Email)(value.email));
    },
  });

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        void form.handleSubmit();
      }}
      noValidate
    >
      <h1 className="text-[32px] font-bold max-[600px]:text-[28px]">{title}</h1>
      <form.Field name="email">
        {(field) => (
          <>
            <label className="mt-[26px] block text-left text-sm font-bold">
              Tu email
              <input
                type="text"
                inputMode="email"
                autoComplete="email"
                value={field.state.value}
                onChange={(event) => field.handleChange(event.target.value)}
                onBlur={field.handleBlur}
                placeholder="nombre@mail.com"
                className="mt-1.5 block w-full rounded-[14px] border-[1.5px] border-line bg-field px-3.5 py-[11px] text-base font-normal text-ink"
                aria-invalid={field.state.meta.errors.length > 0}
                aria-describedby={errorId}
              />
            </label>
            <FieldError id={errorId} error={field.state.meta.errors[0]?.message ?? null} />
            {notice == null || notice === "badCode" ? null : (
              <AuthNotice text={linkNotices[notice]} />
            )}
            <div className="mt-[26px] flex justify-center">
              <Button
                variant="pill-dark"
                type="submit"
                className="px-5 py-[11px] font-display text-[15px] font-medium max-[600px]:w-full max-[600px]:justify-center"
                disabled={field.state.value.trim() === ""}
                pending={sending}
                pendingLabel="Enviando…"
              >
                <Icon name="mail" size={18} />
                Mandame el link
              </Button>
            </div>
          </>
        )}
      </form.Field>
    </form>
  );
};
