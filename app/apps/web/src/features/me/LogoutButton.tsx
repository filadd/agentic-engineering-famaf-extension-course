import { useNavigate } from "@tanstack/react-router";

import { Icon } from "../../ui/Icon.tsx";
import { Spinner } from "../../ui/Spinner.tsx";
import { useLogout } from "./useLogout.ts";

export const LogoutButton = () => {
  const navigate = useNavigate();

  const logout = useLogout({ onSuccess: () => navigate({ to: "/login" }) });

  return (
    <button
      type="button"
      onClick={() => logout.mutate()}
      disabled={logout.isPending}
      aria-busy={logout.isPending ? true : undefined}
      className="flex w-full items-center gap-2.5 rounded-[10px] px-1.5 py-2 text-left text-ink hover:bg-line max-[600px]:py-[11px]"
    >
      {logout.isPending ? (
        <>
          <Spinner size={18} />
          Cerrando sesión…
        </>
      ) : (
        <>
          <Icon name="logout" size={18} />
          Cerrar sesión
        </>
      )}
    </button>
  );
};
