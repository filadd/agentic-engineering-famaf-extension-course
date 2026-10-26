import { useId } from "react";
import type { ComponentProps } from "react";

import { FieldError } from "./FieldError.tsx";

interface Props extends Pick<
  ComponentProps<"input">,
  "type" | "inputMode" | "autoComplete" | "placeholder" | "aria-invalid"
> {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: string | null;
}

export const Field = ({
  label,
  value,
  onChange,
  onBlur,
  error,
  type = "text",
  inputMode,
  autoComplete,
  placeholder,
  "aria-invalid": ariaInvalid,
}: Props) => {
  const errorId = useId();

  return (
    <>
      <label className="field-label">
        {label}
        <input
          type={type}
          inputMode={inputMode}
          autoComplete={autoComplete}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onBlur={onBlur}
          className="input-field"
          aria-invalid={ariaInvalid}
          aria-describedby={errorId}
        />
      </label>
      <FieldError id={errorId} error={error} />
    </>
  );
};
