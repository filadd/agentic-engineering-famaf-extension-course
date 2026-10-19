import * as Predicate from "effect/Predicate";
import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { Switch } from "../../ui/Switch.tsx";
import { SlidesFrame } from "../classroom/SlidesFrame.tsx";
import { isHtml } from "./is-html.ts";
import { slidesNotices } from "./slides-notices.ts";
import { useUploadMaterial } from "./useUploadMaterial.ts";

interface Props {
  sessionId: string;
  onClose: () => void;
}

type Check = "idle" | "checking" | "ok" | "invalid";

interface Chosen {
  file: File;
  html: string | null;
}

// An HTML marked as slides is loaded in a hidden frame before uploading, and
// waits up to five seconds for its manifest; without it, it does not go up as
// slides.
export const UploadMaterialDialog = ({ sessionId, onClose }: Props) => {
  const [chosen, setChosen] = useState<Chosen | null>(null);
  const [name, setName] = useState("");
  const [isSlides, setIsSlides] = useState(false);
  const [check, setCheck] = useState<Check>("idle");

  const upload = useUploadMaterial({ onSuccess: onClose });

  const choose = async (file: File | undefined) => {
    if (file == null) {
      return;
    }

    upload.reset();
    setName(file.name);
    setIsSlides(false);
    setCheck("idle");
    setChosen({ file, html: isHtml(file.name, file.type) ? await file.text() : null });
  };

  const blocked = isSlides && (check === "checking" || check === "invalid");

  return (
    <Sheet open onClose={onClose} title="Subir archivo" width="normal">
      <label className="block rounded-2xl border-2 border-dashed border-line p-[18px] text-center text-sm text-muted">
        <span className="flex justify-center">
          <Icon name="upload" size={26} />
        </span>
        <span className="mt-1.5 block">Arrastrá un archivo o elegí uno</span>
        <input
          type="file"
          aria-label="Elegí un archivo"
          onChange={(event) => void choose(event.target.files?.[0])}
          className="mt-2.5 w-full text-sm"
        />
      </label>
      {chosen == null ? null : (
        <label className="field-label">
          Nombre
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="text-field"
          />
        </label>
      )}
      {chosen?.html == null ? null : (
        <button
          type="button"
          role="switch"
          aria-checked={isSlides}
          onClick={() => {
            setIsSlides(!isSlides);
            setCheck(isSlides ? "idle" : "checking");
          }}
          className="mt-3.5 flex w-full items-center justify-between text-sm"
        >
          <span>Usar como slides del aula</span>
          <Switch on={isSlides} />
        </button>
      )}
      {isSlides && chosen?.html != null && check === "checking" ? (
        <div className="hidden">
          <SlidesFrame
            html={chosen.html}
            hidden
            onManifest={() => setCheck("ok")}
            onInvalid={() => setCheck("invalid")}
          />
        </div>
      ) : null}
      {isSlides && check === "checking" ? (
        <p role="status" className="mt-3 text-sm text-muted">
          {slidesNotices.checking}
        </p>
      ) : null}
      {isSlides && check === "invalid" ? (
        <div
          role="alert"
          className="mt-3 flex gap-2 rounded-[14px] bg-rose px-3.5 py-3 text-sm text-coal"
        >
          <Icon name="danger-circle" size={18} />
          <span>{slidesNotices.invalid}</span>
        </div>
      ) : null}
      {upload.error == null ? null : (
        <div role="alert" className="mt-3 rounded-[14px] bg-rose px-3.5 py-3 text-sm text-coal">
          {Predicate.isTagged(upload.error, "FileTooLarge")
            ? slidesNotices.tooLarge
            : slidesNotices.failed}
        </div>
      )}
      <div className="mt-3.5 flex justify-end gap-2">
        <button type="button" className="pill-button" onClick={onClose}>
          Cancelar
        </button>
        <button
          type="button"
          className="pill-button pill-dark"
          disabled={chosen == null || name.trim() === "" || blocked || upload.isPending}
          onClick={() =>
            chosen == null
              ? undefined
              : upload.mutate({ sessionId, name: name.trim(), isSlides, file: chosen.file })
          }
        >
          Subir
        </button>
      </div>
    </Sheet>
  );
};
