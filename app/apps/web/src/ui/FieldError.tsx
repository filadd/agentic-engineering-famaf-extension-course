import { useEffect, useState } from "react";

interface Props {
  id?: string;
  error: string | null;
}

export const FieldError = ({ id, error }: Props) => {
  const [lastText, setLastText] = useState<string | null>(error);

  if (error != null && error !== lastText) {
    setLastText(error);
  }

  useEffect(() => {
    if (error != null || lastText == null) {
      return undefined;
    }

    const timeout = setTimeout(() => setLastText(null), 180);

    return () => clearTimeout(timeout);
  }, [error, lastText]);

  return (
    <div className="field-error-slot" data-open={error != null} aria-hidden={error == null}>
      <div className="field-error-clip">
        <p className="field-error" id={id}>
          {error ?? lastText}
        </p>
      </div>
    </div>
  );
};
