import { encode } from "uqr";

interface Props {
  text: string;
  label: string;
}

// The QR drawn as one square per dark module, so it scales with the box.
export const QrCode = ({ text, label }: Props) => {
  const qr = encode(text, { border: 2 });

  return (
    <svg
      role="img"
      aria-label={label}
      viewBox={`0 0 ${qr.size} ${qr.size}`}
      className="block size-full bg-paper"
    >
      {qr.data.flatMap((row, y) =>
        row.flatMap((dark, x) =>
          dark ? [<rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#1f1b18" />] : [],
        ),
      )}
    </svg>
  );
};
