import { Link } from "@tanstack/react-router";

export const InvalidLinkNotice = () => (
  <div>
    <h1 className="text-[32px] font-bold max-[600px]:text-[28px]">Este link ya no sirve</h1>
    <p className="mt-2.5 leading-normal text-muted">
      Cada link sirve una sola vez. Pedí uno nuevo para entrar.
    </p>
    <div className="mt-[26px] flex justify-center">
      <Link
        to="/login"
        className="pill-button pill-dark px-5 py-[11px] font-display text-[15px] font-medium"
      >
        Ir al login
      </Link>
    </div>
  </div>
);
