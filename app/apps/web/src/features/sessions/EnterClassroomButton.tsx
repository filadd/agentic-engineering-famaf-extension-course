import { Link } from "@tanstack/react-router";

import { Icon } from "../../ui/Icon.tsx";

export const EnterClassroomButton = () => (
  <div className="mt-4 flex justify-end">
    <Link to="/aula" className="main-button max-[600px]:w-full max-[600px]:py-3">
      Entrar al aula
      <Icon name="arrow-right" size={18} />
    </Link>
  </div>
);
