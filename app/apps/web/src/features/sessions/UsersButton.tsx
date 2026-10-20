import { ButtonLink } from "../../ui/ButtonLink.tsx";
import { Icon } from "../../ui/Icon.tsx";

export const UsersButton = () => (
  <ButtonLink
    variant="pill"
    to="/admin/usuarios"
    className="px-[18px] py-2.5 font-display font-medium"
  >
    <Icon name="users" size={18} />
    Usuarios
  </ButtonLink>
);
