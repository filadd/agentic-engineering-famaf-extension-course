// Valid ULIDs that read as what they name: 01K, a letter for the kind of
// record and a number, padded to 26 characters.
export const ulid = (kind: string, n: number) =>
  `01K${kind}${String(n).padStart(23 - kind.length, "0")}`;
