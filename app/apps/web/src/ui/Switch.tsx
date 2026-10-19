interface Props {
  on: boolean;
}

// The knob of a switch; the button around it carries the role and the label.
export const Switch = ({ on }: Props) => (
  <span
    aria-hidden="true"
    className={`relative h-[22px] w-10 flex-none rounded-full ${on ? "bg-active" : "bg-line"}`}
  >
    <span
      className={`absolute top-[3px] size-4 rounded-full transition-[left] ${
        on ? "left-[21px] bg-active-ink" : "left-[3px] bg-ink"
      }`}
    />
  </span>
);
