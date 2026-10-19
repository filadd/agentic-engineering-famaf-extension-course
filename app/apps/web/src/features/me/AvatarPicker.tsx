import { animals } from "@kurasu/contract/user";
import type { Animal } from "@kurasu/contract/user";
import { useState } from "react";

import { Icon } from "../../ui/Icon.tsx";
import { animalLooks } from "./animals.ts";
import { plainText } from "./plain-text.ts";

interface Props {
  value: Animal | null;
  onChange: (animal: Animal) => void;
}

export const AvatarPicker = ({ value, onChange }: Props) => {
  const [search, setSearch] = useState("");

  const term = plainText(search.trim());
  const matches = animals.filter((animal) => plainText(animalLooks[animal].names).includes(term));

  return (
    <div>
      <label className="mt-2 flex items-center gap-2 rounded-full border-[1.5px] border-line bg-field px-3 text-muted">
        <Icon name="search" size={18} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar un animal"
          aria-label="Buscar un animal"
          className="min-w-0 flex-1 border-0 bg-transparent py-[9px] text-ink outline-none"
        />
      </label>
      <div className="mt-2 grid max-h-[260px] grid-cols-10 gap-1.5 overflow-auto p-[3px] max-[600px]:grid-cols-6 max-[600px]:max-h-[264px]">
        {matches.length === 0 ? (
          <div className="col-span-full py-2 text-sm text-muted">Ningún animal con ese nombre.</div>
        ) : (
          matches.map((animal) => (
            <button
              key={animal}
              type="button"
              title={animalLooks[animal].names}
              aria-label={animalLooks[animal].names}
              aria-pressed={animal === value}
              onClick={() => onChange(animal)}
              className={`grid aspect-square place-items-center rounded-full p-0 text-2xl ${
                animal === value ? "bg-lilac shadow-[0_0_0_3px_var(--ink)]" : "bg-side"
              }`}
            >
              {animalLooks[animal].emoji}
            </button>
          ))
        )}
      </div>
    </div>
  );
};
