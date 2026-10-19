import { createFileRoute, useNavigate } from "@tanstack/react-router";

import { ProfileForm } from "../../features/me/ProfileForm.tsx";
import { ProfilePreview } from "../../features/me/ProfilePreview.tsx";
import { useMe } from "../../features/me/useMe.ts";
import { Icon } from "../../ui/Icon.tsx";

const SetupRoute = () => {
  const me = useMe();
  const navigate = useNavigate();

  return me.data == null ? null : (
    <main className="grid min-h-full place-items-center p-10 max-[600px]:px-5 max-[600px]:py-7">
      <div className="w-[min(480px,100%)]">
        <h1 className="text-[30px] font-bold max-[600px]:text-[26px]">Completá tu perfil</h1>
        <span className="mt-2.5 inline-flex max-w-full items-center gap-2 rounded-full bg-side px-3 py-1 text-sm text-muted">
          <Icon name="mail" size={16} />
          <span className="truncate">{me.data.email}</span>
        </span>
        <ProfileForm
          me={me.data}
          nameLabel="Tu nombre"
          namePlaceholder="Cómo querés que te vean en el aula"
          onSaved={() => navigate({ to: "/" })}
          renderActions={(draft) => (
            <div>
              <ProfilePreview name={draft.name} avatar={draft.avatar} />
              <div className="mt-[26px] flex justify-end">
                <button
                  type="submit"
                  className="pill-button pill-dark px-5 py-[11px] font-display text-[15px] font-medium max-[600px]:w-full max-[600px]:justify-center"
                  disabled={!draft.canSave || draft.saving}
                >
                  Entrar al aula
                  <Icon name="arrow-right" size={18} />
                </button>
              </div>
            </div>
          )}
        />
      </div>
    </main>
  );
};

export const Route = createFileRoute("/_app/setup")({ component: SetupRoute });
