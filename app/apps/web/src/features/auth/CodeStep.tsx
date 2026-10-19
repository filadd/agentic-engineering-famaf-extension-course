import { enrollmentCodeLength } from "@kurasu/contract/user";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { AuthNotice } from "./AuthNotice.tsx";
import { linkNotices } from "./link-notices.ts";

interface Props {
  initialCode: string;
  invalid: boolean;
  onSubmit: (code: string) => void;
}

export const CodeStep = ({ initialCode, invalid, onSubmit }: Props) => {
  const [code, setCode] = useState(initialCode);

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(code);
      }}
    >
      <h1 className="text-[32px] font-bold max-[600px]:text-[28px]">Sumate al aula</h1>
      <p className="mt-2.5 leading-normal text-muted">
        Escribí el código que muestra el profe en clase.
      </p>
      <label className="mt-[26px] block text-left text-sm font-bold">
        Código del aula
        <input
          value={code}
          maxLength={enrollmentCodeLength}
          autoComplete="off"
          placeholder="·····"
          onChange={(event) => setCode(event.target.value.trim().toUpperCase())}
          aria-invalid={invalid}
          className={`mt-1.5 block w-full rounded-[14px] border-[1.5px] bg-field py-3 pr-3.5 pl-[calc(14px+0.3em)] text-center font-display text-[26px] font-bold tracking-[0.3em] text-ink uppercase ${
            invalid ? "border-live" : "border-line"
          }`}
        />
      </label>
      <div className="mt-[26px] flex justify-center">
        <Button
          variant="pill-dark"
          type="submit"
          className="px-5 py-[11px] font-display text-[15px] font-medium max-[600px]:w-full max-[600px]:justify-center"
          disabled={code.length !== enrollmentCodeLength}
        >
          Seguir
          <Icon name="arrow-right" size={18} />
        </Button>
      </div>
      {invalid ? <AuthNotice text={linkNotices.badCode} /> : null}
    </form>
  );
};
