import * as Predicate from "effect/Predicate";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { Sheet } from "../../ui/Sheet.tsx";
import { Switch } from "../../ui/Switch.tsx";
import { isHtml } from "./is-html.ts";
import { SlidesCheckNotice } from "./SlidesCheckNotice.tsx";
import { slidesNotices } from "./slides-notices.ts";
import { useSlidesCheck } from "./useSlidesCheck.ts";
import { useUploadMaterial } from "./useUploadMaterial.ts";

interface Props {
  sessionId: string;
  onClose: () => void;
}

interface Chosen {
  file: File;
  html: string | null;
}

// An HTML marked as slides is checked before uploading. A check that fails
// turns the switch off, so the file can still go up as plain material.
export const UploadMaterialDialog = ({ sessionId, onClose }: Props) => {
  const [chosen, setChosen] = useState<Chosen | null>(null);
  const [name, setName] = useState("");
  const [isSlides, setIsSlides] = useState(false);

  const upload = useUploadMaterial({ onSuccess: onClose });
  const check = useSlidesCheck();

  const checking = check.state === "checking";

  const choose = async (file: File | undefined) => {
    if (file == null) {
      return;
    }

    upload.reset();
    check.reset();
    setName(file.name);
    setIsSlides(false);
    setChosen({ file, html: isHtml(file.name, file.type) ? await file.text() : null });
  };

  const markAsSlides = async (html: string) => {
    setIsSlides(true);

    if ((await check.start(html)) === "invalid") {
      setIsSlides(false);
    }
  };

  return (
    <Sheet open onClose={onClose} title="Subir archivo" width="normal" pending={upload.isPending}>
      {chosen == null ? (
        <label
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => {
            event.preventDefault();
            void choose(event.dataTransfer.files[0]);
          }}
          className="flex cursor-pointer flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-line px-[18px] py-[26px] text-sm text-muted hover:border-muted hover:text-ink"
        >
          <Icon name="upload" size={28} />
          Arrastrá un archivo o elegí uno
          <input
            type="file"
            aria-label="Elegí un archivo"
            onChange={(event) => void choose(event.target.files?.[0])}
            className="sr-only"
          />
        </label>
      ) : (
        <div className="flex items-center gap-2.5 rounded-2xl border-[1.5px] border-line bg-paper py-2 pr-1.5 pl-3.5 text-[15px] text-coal">
          <Icon name={chosen.html == null ? "file-text" : "code"} size={20} />
          <span className="min-w-0 flex-1 truncate">{chosen.file.name}</span>
          <button
            type="button"
            title="Quitar archivo"
            aria-label="Quitar archivo"
            disabled={checking}
            onClick={() => {
              upload.reset();
              check.reset();
              setIsSlides(false);
              setChosen(null);
            }}
            className="icon-button text-coal hover:bg-mist"
          >
            <Icon name="trash" size={18} />
          </button>
        </div>
      )}
      {chosen == null ? null : (
        <label className="field-label">
          Nombre
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            className="input-field"
          />
        </label>
      )}
      {chosen?.html == null ? null : (
        <button
          type="button"
          role="switch"
          aria-checked={isSlides}
          disabled={checking}
          onClick={() => {
            if (isSlides) {
              setIsSlides(false);
              check.reset();
            } else if (chosen.html != null) {
              void markAsSlides(chosen.html);
            }
          }}
          className="mt-3.5 flex w-full items-center justify-between text-sm disabled:cursor-progress"
        >
          <span>Usar como slides del aula</span>
          <Switch on={isSlides} />
        </button>
      )}
      {check.frame}
      <SlidesCheckNotice state={check.state} />
      {upload.error == null ? null : (
        <InlineError className="mt-3">
          {Predicate.isTagged(upload.error, "FileTooLarge")
            ? slidesNotices.tooLarge
            : slidesNotices.failed}
        </InlineError>
      )}
      <div className="mt-3.5 flex justify-end gap-2">
        <Button variant="pill" onClick={onClose} disabled={upload.isPending}>
          Cancelar
        </Button>
        <Button
          variant="pill-dark"
          disabled={chosen == null || name.trim() === "" || checking}
          pending={upload.isPending}
          pendingLabel="Subiendo…"
          onClick={() =>
            chosen == null
              ? undefined
              : upload.mutate({ sessionId, name: name.trim(), isSlides, file: chosen.file })
          }
        >
          Subir
        </Button>
      </div>
    </Sheet>
  );
};
