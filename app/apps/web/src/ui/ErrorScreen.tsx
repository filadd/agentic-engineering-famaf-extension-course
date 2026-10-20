import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";

import { Button } from "./Button.tsx";
import { CrowMark } from "./CrowMark.tsx";
import { Icon } from "./Icon.tsx";

interface Props {
  reset: () => void;
}

// It replaces the whole page, header included, so it only offers the way home.
// The queries that failed go back to their first load; left in their error,
// they would throw again as soon as their page mounts. React Query's error
// boundary reset is not enough: the first query that mounts clears it, and the
// teacher reaches /admin through the student's home, whose useMe mounts first.
export const ErrorScreen = ({ reset }: Props) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (
    <main className="grid min-h-full place-items-center p-10 max-[600px]:px-5 max-[600px]:py-7">
      <div className="w-[min(440px,100%)] text-center">
        <div className="mb-[18px]">
          <CrowMark size="large" />
        </div>
        <h1 className="text-[32px] font-bold max-[600px]:text-[28px]">
          No se pudo cargar la página
        </h1>
        <p className="mt-2.5 leading-normal text-muted">Probá de nuevo en un rato.</p>
        <div className="mt-[26px] flex justify-center max-[600px]:flex-col">
          <Button
            variant="main"
            onClick={() => {
              void queryClient.resetQueries({
                predicate: (query) => query.state.status === "error",
              });
              void navigate({ to: "/" }).then(reset);
            }}
            className="max-[600px]:w-full max-[600px]:py-[13px]"
          >
            <Icon name="arrow-left" size={18} />
            Volver al inicio
          </Button>
        </div>
      </div>
    </main>
  );
};
