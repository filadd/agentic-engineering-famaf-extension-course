import type { Animal } from "@kurasu/contract/user";

import { animalLooks } from "./animals.ts";

interface Props {
  animal: Animal | null;
  size?: "small" | "medium" | "large";
}

const sizes = {
  small: "size-8 text-lg",
  medium: "size-10 text-[22px]",
  large: "size-11 text-[22px] max-[600px]:size-10 max-[600px]:text-xl",
};

export const Avatar = ({ animal, size = "medium" }: Props) => (
  <span
    aria-hidden="true"
    className={`grid flex-none place-items-center rounded-full bg-lilac ${sizes[size]}`}
  >
    {animal == null ? "?" : animalLooks[animal].emoji}
  </span>
);
