export const percent = (count: number, total: number) =>
  total === 0 ? 0 : Math.round((count / total) * 100);
