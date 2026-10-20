import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { AuthCard } from "../features/auth/AuthCard.tsx";
import { CheckMailNotice } from "../features/auth/CheckMailNotice.tsx";
import { EmailStep } from "../features/auth/EmailStep.tsx";
import { linkNoticeOf } from "../features/auth/link-notice-of.ts";
import { useRequestLink } from "../features/me/useRequestLink.ts";

const LoginRoute = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const requestLink = useRequestLink({ onSuccess: () => setSent(true) });

  return (
    <AuthCard>
      {sent ? (
        <CheckMailNotice
          email={email}
          onOtherEmail={() => {
            requestLink.reset();
            setSent(false);
          }}
        />
      ) : (
        <EmailStep
          title="Entrar al aula"
          initialEmail={email}
          sending={requestLink.isPending}
          notice={requestLink.error == null ? null : linkNoticeOf(requestLink.error, false)}
          onSubmit={(next) => {
            setEmail(next);
            requestLink.mutate({ email: next });
          }}
        />
      )}
    </AuthCard>
  );
};

export const Route = createFileRoute("/login")({ component: LoginRoute });
