import { ButtonLink } from "../../ui/ButtonLink.tsx";
import { Icon } from "../../ui/Icon.tsx";

export const EnterClassroomButton = () => (
  <div className="mt-4 flex justify-end">
    <ButtonLink variant="main" to="/aula" className="max-[600px]:w-full max-[600px]:py-3">
      Entrar al aula
      <Icon name="arrow-right" size={18} />
    </ButtonLink>
  </div>
);
