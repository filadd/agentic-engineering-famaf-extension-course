import { feedbackAnchors, feedbackFaces } from "./feedback-faces.ts";

interface Props {
  value: number | null;
  onChange: (pick: number) => void;
  disabled: boolean;
}

export const FeedbackScale = ({ value, onChange, disabled }: Props) => (
  <div>
    <div
      role="radiogroup"
      aria-label="Puntaje de la sesión"
      className="mt-3 grid grid-cols-5 gap-2"
    >
      {feedbackFaces.map((face, index) => (
        <button
          key={face}
          type="button"
          role="radio"
          aria-checked={index + 1 === value}
          aria-label={`${index + 1} de 5`}
          disabled={disabled}
          onClick={() => onChange(index + 1)}
          className={`rounded-[14px] border-2 py-2.5 text-[26px] leading-none text-coal disabled:opacity-50 max-[600px]:py-2 max-[600px]:text-[22px] ${
            index + 1 === value ? "border-coal bg-peach" : "border-sand bg-paper hover:border-coal"
          }`}
        >
          {face}
        </button>
      ))}
    </div>
    <div className="mt-1.5 grid grid-cols-3 gap-2.5 text-xs opacity-70">
      <span>{feedbackAnchors[0]}</span>
      <span className="text-center">{feedbackAnchors[1]}</span>
      <span className="text-right">{feedbackAnchors[2]}</span>
    </div>
  </div>
);
