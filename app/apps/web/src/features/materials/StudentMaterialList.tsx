import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { DownloadButton } from "./DownloadButton.tsx";
import { materialExamples } from "./material-examples.ts";
import { MaterialList } from "./MaterialList.tsx";
import { useMaterials } from "./useMaterials.ts";

interface Props {
  sessionId: string;
}

export const StudentMaterialList = ({ sessionId }: Props) => {
  const materials = useMaterials(sessionId);

  return materials.data == null ? (
    <SkeletonOf>
      <MaterialList
        materials={materialExamples}
        renderActions={(material) => <DownloadButton material={material} />}
      />
    </SkeletonOf>
  ) : (
    <MaterialList
      materials={materials.data}
      renderActions={(material) => <DownloadButton material={material} />}
    />
  );
};
