import { Button } from "../../ui/Button.tsx";
import { Field } from "../../ui/Field.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { useEmailForm } from "../../helpers/useEmailForm.ts";
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

export const EmailStep = ({ title, initialEmail, notice, sending, onSubmit }: Props) => {
  const { form } = useEmailForm({ initialEmail, onValidEmail: onSubmit });

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
            <Field
              label="Tu email"
              type="text"
              inputMode="email"
              autoComplete="email"
              placeholder="nombre@mail.com"
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              aria-invalid={field.state.meta.errors.length > 0}
              error={field.state.meta.errors[0]?.message}
            />
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
