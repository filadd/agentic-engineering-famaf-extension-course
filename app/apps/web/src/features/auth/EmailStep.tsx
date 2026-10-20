import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
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

export const EmailStep = ({ title, initialEmail, notice, sending, onSubmit }: Props) => {
  const [email, setEmail] = useState(initialEmail);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(email.trim());
      }}
    >
      <h1 className="text-[32px] font-bold max-[600px]:text-[28px]">{title}</h1>
      <label className="mt-[26px] block text-left text-sm font-bold">
        Tu email
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nombre@mail.com"
          className="mt-1.5 block w-full rounded-[14px] border-[1.5px] border-line bg-field px-3.5 py-[11px] text-base font-normal text-ink"
        />
      </label>
      <div className="mt-[26px] flex justify-center">
        <Button
          variant="pill-dark"
          type="submit"
          className="px-5 py-[11px] font-display text-[15px] font-medium max-[600px]:w-full max-[600px]:justify-center"
          disabled={!email.includes("@")}
          pending={sending}
          pendingLabel="Enviando…"
        >
          <Icon name="mail" size={18} />
          Mandame el link
        </Button>
      </div>
      {notice == null || notice === "badCode" ? null : <AuthNotice text={linkNotices[notice]} />}
    </form>
  );
};
