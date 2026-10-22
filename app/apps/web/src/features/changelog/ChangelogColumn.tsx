import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";
import { AnnouncementDialog } from "./AnnouncementDialog.tsx";
import { changelogExamples } from "./changelog-examples.ts";
import { ChangelogEntries } from "./ChangelogEntries.tsx";
import { useChangelog } from "./useChangelog.ts";

interface Props {
  sessionId: string;
  enabled?: boolean | undefined;
}

const noop = () => undefined;

// Only an enabled session is announced: the one link of the mail leads to it,
// and a student cannot open a disabled one.
export const ChangelogColumn = ({ sessionId, enabled }: Props) => {
  const changelog = useChangelog(sessionId);

  const [chosen, setChosen] = useState<ReadonlySet<string>>(new Set());
  const [composing, setComposing] = useState(false);

  const toggle = (id: string) =>
    setChosen((current) => {
      const next = new Set(current);

      if (!next.delete(id)) {
        next.add(id);
      }

      return next;
    });

  return (
    <section aria-label="Novedades pendientes" className="rounded-[22px] bg-side p-[18px]">
      <h3 className="mb-2.5 flex items-center gap-2 text-[17px] font-bold">
        <Icon name="bell" size={18} />
        Novedades pendientes
      </h3>
      {changelog.data == null ? (
        <SkeletonOf>
          <ChangelogEntries entries={changelogExamples} chosen={new Set()} onToggle={noop} />
        </SkeletonOf>
      ) : (
        <ChangelogEntries entries={changelog.data} chosen={chosen} onToggle={toggle} />
      )}
      <div className="mt-3 flex items-center justify-end gap-2">
        {enabled === false ? (
          <span className="mr-auto text-sm text-muted">
            Habilitá la sesión para mandar un anuncio.
          </span>
        ) : null}
        <Button variant="pill-dark" disabled={enabled !== true} onClick={() => setComposing(true)}>
          <Icon name="mail" size={16} />
          Redactar anuncio
        </Button>
      </div>
      {composing ? (
        <AnnouncementDialog
          sessionId={sessionId}
          entries={(changelog.data ?? []).filter((entry) => chosen.has(entry.id))}
          onClose={() => setComposing(false)}
          onSent={() => {
            setChosen(new Set());
            setComposing(false);
          }}
        />
      ) : null}
    </section>
  );
};
