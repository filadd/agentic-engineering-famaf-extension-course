interface Props {
  size: "small" | "large";
}

const sizes = {
  small: "text-[28px] max-[600px]:text-2xl",
  large: "text-[64px]",
};

export const CrowMark = ({ size }: Props) => (
  <span
    aria-hidden="true"
    className={`inline-block flex-none font-emoji leading-none ${sizes[size]}`}
  >
    🐦‍⬛
  </span>
);
