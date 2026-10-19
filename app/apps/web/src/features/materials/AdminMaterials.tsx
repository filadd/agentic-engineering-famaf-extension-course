import type { Material } from "@kurasu/contract/materials";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { showError } from "../../ui/toast.ts";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { DeleteMaterialButton } from "./DeleteMaterialButton.tsx";
import { isHtml } from "./is-html.ts";
import { materialExamples } from "./material-examples.ts";
import { MarkSlidesButton } from "./MarkSlidesButton.tsx";
import { MaterialList } from "./MaterialList.tsx";
import { SlidesChip } from "./SlidesChip.tsx";
import { SlidesCheckNotice } from "./SlidesCheckNotice.tsx";
import { UploadMaterialDialog } from "./UploadMaterialDialog.tsx";
import { useAdminMaterials } from "./useAdminMaterials.ts";
import { materialFileQuery } from "./material-file-query.ts";
import { useSlidesCheck } from "./useSlidesCheck.ts";
import { useUpdateMaterial } from "./useUpdateMaterial.ts";

interface Props {
  sessionId: string;
}

const renderLeading = (material: Material) => (
  <Icon name={isHtml(material.name, material.contentType) ? "code" : "file-text"} size={20} />
);

// Marking an uploaded HTML as slides runs the same check as the upload, once
// its text is downloaded. An ok marks it and goes away after ten seconds; an
// error stays until the next mark.
export const AdminMaterials = ({ sessionId }: Props) => {
  const queryClient = useQueryClient();
  const materials = useAdminMaterials(sessionId);
  const update = useUpdateMaterial();
  const check = useSlidesCheck({ okFor: 10_000 });

  const [uploading, setUploading] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const checking = downloading || check.state === "checking";

  const mark = async (material: Material) => {
    check.reset();
    setDownloading(true);

    const html = await queryClient
      .fetchQuery(materialFileQuery(material.id))
      .catch(() => null)
      .finally(() => setDownloading(false));

    if (html == null) {
      showError("No se pudo abrir el archivo.");

      return;
    }

    if ((await check.start(html)) === "ok") {
      update.mutate({ id: material.id, isSlides: true });
    }
  };

  return (
    <section aria-label="Material" className="rounded-[22px] bg-side p-[18px]">
      <div className="mb-2.5 flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-[17px] font-bold">
          <Icon name="download" size={18} />
          Material
        </h3>
        <Button variant="pill" onClick={() => setUploading(true)}>
          <Icon name="upload" size={16} />
          Subir archivo
        </Button>
      </div>
      {materials.data == null ? (
        <SkeletonOf>
          <MaterialList
            materials={materialExamples.slice(0, 2)}
            renderLeading={renderLeading}
            renderActions={(material) => <DeleteMaterialButton material={material} />}
          />
        </SkeletonOf>
      ) : (
        <MaterialList
          materials={materials.data}
          renderLeading={renderLeading}
          renderActions={(material) => (
            <>
              {material.isSlides ? <SlidesChip /> : null}
              {!material.isSlides && isHtml(material.name, material.contentType) ? (
                <MarkSlidesButton
                  material={material}
                  checking={checking}
                  onMark={(each) => void mark(each)}
                />
              ) : null}
              <DeleteMaterialButton material={material} />
            </>
          )}
        />
      )}
      {check.frame}
      {downloading ? (
        <SlidesCheckNotice state="checking" />
      ) : (
        <SlidesCheckNotice state={check.state} />
      )}
      {uploading ? (
        <UploadMaterialDialog sessionId={sessionId} onClose={() => setUploading(false)} />
      ) : null}
    </section>
  );
};
