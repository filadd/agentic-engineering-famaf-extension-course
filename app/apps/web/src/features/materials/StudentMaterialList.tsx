import { DownloadButton } from "./DownloadButton.tsx";
import { MaterialList } from "./MaterialList.tsx";
import { useMaterials } from "./useMaterials.ts";

interface Props {
  sessionId: string;
}

export const StudentMaterialList = ({ sessionId }: Props) => {
  const materials = useMaterials(sessionId);

  return materials.data == null ? null : (
    <MaterialList
      materials={materials.data}
      renderActions={(material) => <DownloadButton material={material} />}
    />
  );
};
