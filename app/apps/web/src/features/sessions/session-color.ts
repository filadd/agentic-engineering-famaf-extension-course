const colors = ["bg-rose", "bg-peach", "bg-lilac", "bg-mint"];

// The prototypes paint each session by its number, cycling four colours.
export const sessionColor = (position: number) => colors[Math.abs(position) % colors.length];
