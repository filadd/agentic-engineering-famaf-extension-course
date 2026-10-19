import { Sheet } from "../../ui/Sheet.tsx";
import { StudentMaterialList } from "./StudentMaterialList.tsx";

interface Props {
  sessionId: string;
  onClose: () => void;
}

export const MaterialSheet = ({ sessionId, onClose }: Props) => (
  <Sheet open onClose={onClose} title="Material">
    <StudentMaterialList sessionId={sessionId} />
  </Sheet>
);
