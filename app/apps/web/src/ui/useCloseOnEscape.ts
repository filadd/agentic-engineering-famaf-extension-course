import { useEffect, useEffectEvent } from "react";

// Open backdrops stack in the order they opened, and Escape closes only the
// top one: a confirmation over a sheet closes without the sheet. One shared
// listener, because a browser runs the microtasks between listeners, so a
// second listener would already see the sheet on top and close it as well.
const closers: Array<() => void> = [];

const closeTop = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closers.at(-1)?.();
  }
};

export const useCloseOnEscape = (onClose: () => void) => {
  const close = useEffectEvent(onClose);

  useEffect(() => {
    const closer = () => close();

    if (closers.length === 0) {
      document.addEventListener("keydown", closeTop);
    }

    closers.push(closer);

    return () => {
      closers.splice(closers.indexOf(closer), 1);

      if (closers.length === 0) {
        document.removeEventListener("keydown", closeTop);
      }
    };
  }, []);
};
