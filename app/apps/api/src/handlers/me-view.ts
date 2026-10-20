import type { Me, User } from "@kurasu/contract/user";

export const toMe = (user: User): Me => ({
  id: user.id,
  email: user.email,
  name: user.name,
  avatar: user.avatar,
  role: user.role,
});
