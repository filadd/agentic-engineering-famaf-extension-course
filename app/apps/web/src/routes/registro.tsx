import { createFileRoute } from "@tanstack/react-router";
import * as Schema from "effect/Schema";
import { useState } from "react";

import { AuthCard } from "../features/auth/AuthCard.tsx";
import { CheckMailNotice } from "../features/auth/CheckMailNotice.tsx";
import { CodeStep } from "../features/auth/CodeStep.tsx";
import { EmailStep } from "../features/auth/EmailStep.tsx";
import { linkNoticeOf } from "../features/auth/link-notice-of.ts";
import { useRequestLink } from "../features/me/useRequestLink.ts";

const RegisterSearch = Schema.Struct({ codigo: Schema.optional(Schema.String) });

type Step = "code" | "email" | "checkMail";

const RegisterRoute = () => {
  const { codigo } = Route.useSearch();

  const [code, setCode] = useState(codigo?.toUpperCase() ?? "");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<Step>(codigo == null ? "code" : "email");

  const requestLink = useRequestLink({ onSuccess: () => setStep("checkMail") });

  const notice = requestLink.error == null ? null : linkNoticeOf(requestLink.error, true);

  // A code that is not the current one comes back as NotRegistered; the
  // person fixes it in the code step.
  const visibleStep = notice === "badCode" ? "code" : step;

  return (
    <AuthCard>
      {visibleStep === "checkMail" ? (
        <CheckMailNotice
          email={email}
          onOtherEmail={() => {
            requestLink.reset();
            setStep("email");
          }}
        />
      ) : null}
      {visibleStep === "code" ? (
        <CodeStep
          initialCode={code}
          invalid={notice === "badCode"}
          onSubmit={(next) => {
            requestLink.reset();
            setCode(next);
            setStep("email");
          }}
        />
      ) : null}
      {visibleStep === "email" ? (
        <EmailStep
          title="Sumate al aula"
          initialEmail={email}
          sending={requestLink.isPending}
          notice={notice}
          onSubmit={(next) => {
            setEmail(next);
            requestLink.mutate({ email: next, enrollmentCode: code });
          }}
        />
      ) : null}
    </AuthCard>
  );
};

export const Route = createFileRoute("/registro")({
  validateSearch: Schema.toStandardSchemaV1(RegisterSearch),
  component: RegisterRoute,
});
