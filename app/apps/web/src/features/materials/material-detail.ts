import type { Material } from "@kurasu/contract/materials";

const units = ["B", "KB", "MB", "GB"];

const sizeOf = (bytes: number) => {
  const power = Math.min(
    units.length - 1,
    Math.floor(Math.log(Math.max(bytes, 1)) / Math.log(1024)),
  );

  const value = bytes / 1024 ** power;

  return `${value.toLocaleString("es-AR", { maximumFractionDigits: power < 2 ? 0 : 1 })} ${units[power]}`;
};

const kindOf = (material: Material) => {
  const extension = material.name.includes(".") ? material.name.split(".").at(-1) : undefined;

  return (extension ?? material.contentType.split("/").at(-1) ?? "").toUpperCase();
};

// "PDF · 480 KB", as the material rows of the prototypes read.
export const materialDetail = (material: Material) =>
  `${kindOf(material)} · ${sizeOf(material.size)}`;
