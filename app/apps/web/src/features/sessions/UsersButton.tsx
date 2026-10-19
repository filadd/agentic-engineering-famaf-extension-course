import { Button } from "../../ui/Button.tsx";
import { Icon } from "../../ui/Icon.tsx";

export const UsersButton = () => (
  <Button
    variant="pill"
    href="/admin/usuarios"
    className="px-[18px] py-2.5 font-display font-medium"
  >
    <Icon name="users" size={18} />
    Usuarios
  </Button>
);
