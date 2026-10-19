import type { Poll, ResponseValue } from "@kurasu/contract/polls";
import * as Predicate from "effect/Predicate";
import { useState } from "react";

import { Button } from "../../ui/Button.tsx";
import { PollResults } from "./PollResults.tsx";
import { scaleLabelsOf } from "./scale-labels.ts";
import { useVote } from "./useVote.ts";
import { mergeWords } from "./words.ts";

interface Props {
  poll: Poll;
  onClosed?: () => void;
}

const scaleValues = [1, 2, 3, 4, 5];

const textLink = "text-sm text-coal underline";

export const VoteForm = ({ poll, onClosed }: Props) => {
  const [changing, setChanging] = useState(false);
  const [draft, setDraft] = useState("");

  const vote = useVote({
    onSuccess: () => {
      setChanging(false);
      setDraft("");
    },
    onError: (error) => (Predicate.isTagged(error, "PollNotActive") ? onClosed?.() : undefined),
  });

  const mine = poll.myResponse;
  const editing = mine == null || changing;
  const words = mine != null && "words" in mine ? mine.words : [];
  const send = (myResponse: ResponseValue) => vote.mutate({ pollId: poll.id, myResponse });

  if (poll.type === "words") {
    return (
      <div>
        {editing ? (
          <form
            className="mt-2.5 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              send({ words: mergeWords(words, draft) });
            }}
          >
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={
                mine == null
                  ? "Tus palabras, separadas por coma"
                  : "Más palabras, separadas por coma"
              }
              aria-label={mine == null ? "Tus palabras" : "Más palabras"}
              className="min-w-0 flex-1 rounded-full border-2 border-coal bg-paper px-3.5 py-[7px] text-coal"
            />
            <Button
              variant="main"
              type="submit"
              disabled={mergeWords([], draft).length === 0 || vote.isPending}
              className="px-3.5 py-1.5 text-sm"
            >
              Enviar
            </Button>
          </form>
        ) : null}
        {words.length === 0 ? null : (
          <div className="mt-2 text-[13px] opacity-70">Tus palabras: {words.join(", ")}</div>
        )}
        {editing || poll.results == null ? null : (
          <PollResults type="words" results={poll.results} mine={mine} />
        )}
        {mine == null ? null : (
          <div className="mt-2.5 flex justify-end">
            <button type="button" className={textLink} onClick={() => setChanging(!changing)}>
              {changing ? "Cancelar" : "Sumar más palabras"}
            </button>
          </div>
        )}
      </div>
    );
  }

  if (!editing) {
    return (
      <div>
        {poll.results == null ? null : (
          <PollResults
            type={poll.type}
            results={poll.results}
            options={poll.options}
            scaleLabels={scaleLabelsOf(poll)}
            mine={mine}
          />
        )}
        <div className="mt-2.5 flex justify-end">
          <button type="button" className={textLink} onClick={() => setChanging(true)}>
            Cambiar mi voto
          </button>
        </div>
      </div>
    );
  }

  const chosen = mine != null && "choice" in mine ? mine.choice : null;
  const rated = mine != null && "scale" in mine ? mine.scale : null;
  const [minLabel, maxLabel] = scaleLabelsOf(poll);

  return (
    <div>
      {poll.type === "choice" ? (
        <div className="mt-3 flex flex-col gap-2">
          {(poll.options ?? []).map((option, index) => (
            <button
              key={option}
              type="button"
              aria-pressed={index === chosen}
              disabled={vote.isPending}
              onClick={() => send({ choice: index })}
              className={`flex justify-between gap-2.5 rounded-xl border-2 bg-paper px-3.5 py-[9px] text-left text-coal max-[600px]:px-3 max-[600px]:py-2.5 ${
                index === chosen ? "border-coal" : "border-sand"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <div>
          <div className="mt-2.5 grid grid-cols-5 gap-2">
            {scaleValues.map((value) => (
              <button
                key={value}
                type="button"
                aria-pressed={value === rated}
                disabled={vote.isPending}
                onClick={() => send({ scale: value })}
                className={`rounded-[14px] border-2 border-coal py-2 text-xl max-[600px]:py-2.5 ${
                  value === rated ? "bg-coal text-white" : "bg-paper text-coal"
                }`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="mt-1 flex justify-between gap-2.5 text-xs opacity-70">
            <span>{minLabel}</span>
            <span>{maxLabel}</span>
          </div>
        </div>
      )}
      {mine == null ? null : (
        <div className="mt-2.5 flex justify-end">
          <button type="button" className={textLink} onClick={() => setChanging(false)}>
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
};
