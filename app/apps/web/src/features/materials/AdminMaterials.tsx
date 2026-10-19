import type { Material } from "@kurasu/contract/materials";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { InlineError } from "../../ui/InlineError.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { SlidesFrame } from "../classroom/SlidesFrame.tsx";
import { DeleteMaterialButton } from "./DeleteMaterialButton.tsx";
import { isHtml } from "./is-html.ts";
import { materialExamples } from "./material-examples.ts";
import { MarkSlidesButton } from "./MarkSlidesButton.tsx";
import { MaterialList } from "./MaterialList.tsx";
import { SlidesChip } from "./SlidesChip.tsx";
import { slidesNotices } from "./slides-notices.ts";
import { UploadMaterialDialog } from "./UploadMaterialDialog.tsx";
import { useAdminMaterials } from "./useAdminMaterials.ts";
import { materialFileQuery } from "./material-file-query.ts";
import { useUpdateMaterial } from "./useUpdateMaterial.ts";

interface Props {
  sessionId: string;
}

interface Marking {
  material: Material;
  html: string | null;
  invalid: boolean;
}

const renderLeading = (material: Material) => (
  <Icon name={isHtml(material.name, material.contentType) ? "code" : "file-text"} size={20} />
);

// Marking an uploaded HTML as slides runs the same check as the upload: the
// file is loaded in a hidden frame and has five seconds to announce itself.
export const AdminMaterials = ({ sessionId }: Props) => {
  const queryClient = useQueryClient();
  const materials = useAdminMaterials(sessionId);
  const update = useUpdateMaterial();

  const [uploading, setUploading] = useState(false);
  const [marking, setMarking] = useState<Marking | null>(null);

  const checking = marking != null && !marking.invalid;

  const mark = async (material: Material) => {
    setMarking({ material, html: null, invalid: false });

    const html = await queryClient.fetchQuery(materialFileQuery(material.id));

    setMarking({ material, html, invalid: false });
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
      {checking && marking.html != null ? (
        <div className="hidden">
          <SlidesFrame
            html={marking.html}
            hidden
            onManifest={() => {
              update.mutate({ id: marking.material.id, isSlides: true });
              setMarking(null);
            }}
            onInvalid={() => setMarking({ ...marking, invalid: true })}
          />
        </div>
      ) : null}
      {checking ? (
        <p role="status" className="mt-2 text-sm text-muted">
          {slidesNotices.checking}
        </p>
      ) : null}
      {marking?.invalid === true ? (
        <InlineError className="mt-2">{slidesNotices.invalid}</InlineError>
      ) : null}
      {uploading ? (
        <UploadMaterialDialog sessionId={sessionId} onClose={() => setUploading(false)} />
      ) : null}
    </section>
  );
};
