import { useEffect, useState } from "react";

interface Props {
  id?: string;
  error: string | null;
}

export const FieldError = ({ id, error }: Props) => {
  const [lastText, setLastText] = useState<string | null>(error);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout> | undefined;

    if (error != null) {
      timeout = setTimeout(() => setLastText(error), 0);
    } else if (lastText != null) {
      timeout = setTimeout(() => setLastText(null), 180);
    }

    return () => {
      if (timeout != null) {
        clearTimeout(timeout);
      }
    };
  }, [error, lastText]);

  const text = error ?? lastText;

  return (
    <div className="field-error-slot" data-open={error != null} aria-hidden={error == null}>
      <div className="field-error-clip">
        <p className="field-error" id={id}>
          {text}
        </p>
      </div>
    </div>
  );
};
