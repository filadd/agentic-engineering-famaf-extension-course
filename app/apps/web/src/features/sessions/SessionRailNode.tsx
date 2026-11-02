import { Icon } from "../../ui/Icon.tsx";
import { RailNode, type RailNodeLook } from "./RailNode.tsx";

interface Props {
  look: Exclude<RailNodeLook, "new">;
}

export const SessionRailNode = ({ look }: Props) => (
  <RailNode look={look}>
    {look === "done" ? <Icon name="check" size={20} /> : null}
    {look === "live" ? (
      <Icon name="star" size={26} className="fill-current max-[600px]:size-5" />
    ) : null}
  </RailNode>
);
