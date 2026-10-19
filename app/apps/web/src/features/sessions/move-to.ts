// The dropped card takes the place of the one it lands on.
export const moveTo = (ids: ReadonlyArray<string>, moved: string, target: string) => {
  const rest = ids.filter((id) => id !== moved);
  const index = ids.indexOf(target);

  return [...rest.slice(0, index), moved, ...rest.slice(index)];
};
