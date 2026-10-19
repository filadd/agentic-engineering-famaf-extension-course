import type { Me } from "@kurasu/contract/user";
import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { meExample } from "../../features/me/me-example.ts";
import { ProfileForm } from "../../features/me/ProfileForm.tsx";
import { ProfilePreview } from "../../features/me/ProfilePreview.tsx";
import { useMe } from "../../features/me/useMe.ts";
import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";
import { SkeletonOf } from "../../ui/SkeletonOf.tsx";

const SetupRoute = () => {
  const me = useMe();
  const navigate = useNavigate();

  const profile = (shown: Me) => (
    <>
      <span className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-full bg-side px-3 py-1 text-sm text-muted">
        <Icon name="mail" size={16} />
        <span className="truncate">{shown.email}</span>
      </span>
      <ProfileForm
        me={shown}
        nameLabel="Tu nombre"
        namePlaceholder="Cómo querés que te vean en el aula"
        onSaved={() => navigate({ to: "/" })}
        renderActions={(draft) => (
          <div>
            <ProfilePreview name={draft.name} avatar={draft.avatar} />
            <div className="mt-[26px] flex justify-end">
              <Button
                variant="pill-dark"
                type="submit"
                className="px-5 py-[11px] font-display text-[15px] font-medium max-[600px]:w-full max-[600px]:justify-center"
                disabled={!draft.canSave}
                pending={draft.saving}
                pendingLabel="Guardando…"
              >
                Entrar al aula
                <Icon name="arrow-right" size={18} />
              </Button>
            </div>
          </div>
        )}
      />
    </>
  );

  return (
    <main className="grid min-h-full place-items-center p-10 max-[600px]:px-5 max-[600px]:py-7">
      <div className="w-[min(480px,100%)]">
        <h1 className="text-[30px] font-bold max-[600px]:text-[26px]">Completá tu perfil</h1>
        {me.data == null ? <SkeletonOf>{profile(meExample)}</SkeletonOf> : profile(me.data)}
      </div>
    </main>
  );
};

export const Route = createFileRoute("/_app/setup")({ component: SetupRoute });
