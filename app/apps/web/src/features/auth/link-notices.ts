export const linkNotices = {
  noAccess: "Tu cuenta todavía no tiene acceso al aula. Pedile al profe que te habilite.",
  notRegistered: "Ese email no está registrado. Pedile acceso al profe.",
  mailNotSent: "No pudimos mandarte el mail. Probá de nuevo en un rato.",
  badCode: "Ese código no es el del aula. Revisalo y probá de nuevo.",
} as const;

export type LinkNotice = keyof typeof linkNotices;
