import { Sheet } from "../../ui/Sheet.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { ClosedPolls } from "./ClosedPolls.tsx";
import { closedPollExamples } from "./poll-examples.ts";
import { usePolls } from "./usePolls.ts";

interface Props {
  sessionId: string;
  onClose: () => void;
}

export const ClosedPollsSheet = ({ sessionId, onClose }: Props) => {
  const closedPolls = usePolls({ sessionId, status: "closed" });

  return (
    <Sheet open onClose={onClose} title="Encuestas cerradas">
      {closedPolls.data == null ? (
        <SkeletonOf>
          <ClosedPolls polls={closedPollExamples} />
        </SkeletonOf>
      ) : (
        <ClosedPolls polls={closedPolls.data} />
      )}
    </Sheet>
  );
};
