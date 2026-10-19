import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { NewSessionDialog } from "./NewSessionDialog.tsx";
import { RailNode } from "./RailNode.tsx";

interface Props {
  onCreated: (id: string) => void;
}

export const NewSessionCard = ({ onCreated }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="flex flex-col items-center">
        <RailNode look="new">
          <Icon name="plus" size={20} />
        </RailNode>
      </div>
      <div className="pb-3">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center gap-2 rounded-[22px] border-2 border-dashed border-muted px-[18px] py-3 font-display font-medium text-muted hover:border-ink hover:text-ink"
        >
          <Icon name="plus" size={20} />
          Nueva sesión
        </button>
      </div>
      {open ? (
        <NewSessionDialog
          onClose={() => setOpen(false)}
          onCreated={(id) => {
            setOpen(false);
            onCreated(id);
          }}
        />
      ) : null}
    </>
  );
};
