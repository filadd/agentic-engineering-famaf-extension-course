// Accents are ignored so "tiburon" finds the shark.
export const plainText = (text: string) =>
  text
    .normalize("NFD")
    .replaceAll(/[̀-ͯ]/g, "")
    .toLowerCase();
