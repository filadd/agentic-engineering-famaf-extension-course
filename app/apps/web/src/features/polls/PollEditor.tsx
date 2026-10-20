import { maxOptions } from "@kurasu/contract/polls";
import type { PollType } from "@kurasu/contract/polls";

import { Icon } from "../../ui/Icon.tsx";
import type { PollContent } from "./poll-content.ts";

interface Props {
  type: PollType;
  value: PollContent;
  onChange: (value: PollContent) => void;
}

const input =
  "min-w-0 flex-1 rounded-[10px] border-[1.5px] border-sand px-2.5 py-[7px] text-sm text-coal";

export const PollEditor = ({ type, value, onChange }: Props) => (
  <div className="mt-2">
    <input
      value={value.prompt}
      onChange={(event) => onChange({ ...value, prompt: event.target.value })}
      placeholder="Pregunta"
      aria-label="Pregunta"
      className={`${input} w-full`}
    />
    {type === "choice" ? (
      <div>
        {value.options.map((option, index) => (
          // The options have no id of their own; their place is their identity.
          // oxlint-disable-next-line react/no-array-index-key
          <div key={index} className="mt-1.5 flex gap-1.5">
            <input
              value={option}
              onChange={(event) =>
                onChange({ ...value, options: value.options.with(index, event.target.value) })
              }
              placeholder={`Opción ${index + 1}`}
              aria-label={`Opción ${index + 1}`}
              className={input}
            />
            <button
              type="button"
              title="Quitar"
              aria-label={`Quitar la opción ${index + 1}`}
              disabled={value.options.length <= 2}
              onClick={() =>
                onChange({ ...value, options: value.options.filter((_, each) => each !== index) })
              }
              className="icon-button text-coal"
            >
              <Icon name="x" size={16} />
            </button>
          </div>
        ))}
        {value.options.length < maxOptions ? (
          <button
            type="button"
            onClick={() => onChange({ ...value, options: [...value.options, ""] })}
            className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-[10px] border-[1.5px] border-dashed border-[#d9c9bf] px-2.5 py-1.5 text-[13px] text-coal"
          >
            <Icon name="plus" size={16} />
            Agregar opción
          </button>
        ) : null}
      </div>
    ) : null}
    {type === "scale" ? (
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-stone">
        <label>
          Qué significa el 1
          <input
            value={value.scaleMinLabel}
            onChange={(event) => onChange({ ...value, scaleMinLabel: event.target.value })}
            className={`${input} mt-[3px] block w-full`}
          />
        </label>
        <label>
          Qué significa el 5
          <input
            value={value.scaleMaxLabel}
            onChange={(event) => onChange({ ...value, scaleMaxLabel: event.target.value })}
            className={`${input} mt-[3px] block w-full`}
          />
        </label>
      </div>
    ) : null}
  </div>
);
