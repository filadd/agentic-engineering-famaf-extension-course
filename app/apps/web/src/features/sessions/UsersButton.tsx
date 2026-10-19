import { Link } from "@tanstack/react-router";

import { Icon } from "../../ui/Icon.tsx";

export const UsersButton = () => (
  <Link to="/admin/usuarios" className="pill-button px-[18px] py-2.5 font-display font-medium">
    <Icon name="users" size={18} />
    Usuarios
  </Link>
);
