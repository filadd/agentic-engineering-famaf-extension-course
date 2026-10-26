import { useId } from "react";
import * as Schema from "effect/Schema";
import { revalidateLogic, useForm } from "@tanstack/react-form";

import { Email } from "@kurasu/contract/user";

const emailFormSchema = Schema.toStandardSchemaV1(Schema.Struct({ email: Email }));

interface Props {
  initialEmail: string;
  onValidEmail: (email: string) => void;
}

// canSubmitWhenInvalid: the submit button gates on an empty email, not on validity, so an invalid send reaches onSubmit and shows the field error.
export const useEmailForm = ({ initialEmail, onValidEmail }: Props) => {
  const errorId = useId();

  const form = useForm({
    defaultValues: { email: initialEmail },
    validationLogic: revalidateLogic(),
    canSubmitWhenInvalid: true,
    validators: { onDynamic: emailFormSchema },
    onSubmit: ({ value }) => {
      onValidEmail(Schema.decodeSync(Email)(value.email));
    },
  });

  return { form, errorId };
};
