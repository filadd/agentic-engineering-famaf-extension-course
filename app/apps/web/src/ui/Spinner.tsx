interface Props {
  size?: number;
}

export const Spinner = ({ size = 16 }: Props) => (
  <span
    aria-hidden="true"
    style={{ width: size, height: size }}
    className="flex-none animate-spin rounded-full border-2 border-current border-r-transparent"
  />
);
