import { Button } from "../../ui/Button.tsx";

export const InvalidLinkNotice = () => (
  <div>
    <h1 className="text-[32px] font-bold max-[600px]:text-[28px]">Este link ya no sirve</h1>
    <p className="mt-2.5 leading-normal text-muted">
      Cada link sirve una sola vez. Pedí uno nuevo para entrar.
    </p>
    <div className="mt-[26px] flex justify-center">
      <Button
        variant="pill-dark"
        href="/login"
        className="px-5 py-[11px] font-display text-[15px] font-medium"
      >
        Ir al login
      </Button>
    </div>
  </div>
);
