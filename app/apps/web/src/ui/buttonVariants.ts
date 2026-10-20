export const buttonVariants = {
  main: "main-button",
  pill: "pill-button",
  "pill-dark": "pill-button pill-dark",
  "pill-danger": "pill-button pill-danger",
} as const;

export const buttonClass = (variant: keyof typeof buttonVariants, className?: string) =>
  className == null ? buttonVariants[variant] : `${buttonVariants[variant]} ${className}`;
