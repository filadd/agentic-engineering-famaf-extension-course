import type { Session } from "@kurasu/contract/sessions";
import { useState } from "react";

import { useUpdateSession } from "./useUpdateSession.ts";

interface Props {
  session: Session;
}

export const SessionDetailsForm = ({ session }: Props) => {
  const [title, setTitle] = useState(session.title);
  const [summary, setSummary] = useState(session.summary);

  const update = useUpdateSession();

  const changed = title.trim() !== session.title || summary.trim() !== session.summary;

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        update.mutate({ id: session.id, change: { title: title.trim(), summary: summary.trim() } });
      }}
    >
      <label className="mt-3 block text-[13px]">
        Título
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          className="mt-1 block w-full rounded-xl bg-paper px-3 py-[9px] text-[15px] text-coal"
        />
      </label>
      <label className="mt-3 block text-[13px]">
        Resumen
        <textarea
          value={summary}
          onChange={(event) => setSummary(event.target.value)}
          className="mt-1 block min-h-[70px] w-full resize-y rounded-xl bg-paper px-3 py-[9px] text-[15px] text-coal"
        />
      </label>
      {changed ? (
        <div className="mt-3 flex justify-end">
          <button
            type="submit"
            disabled={title.trim() === "" || update.isPending}
            className="main-button px-3.5 py-[7px] text-sm"
          >
            Guardar
          </button>
        </div>
      ) : null}
    </form>
  );
};
