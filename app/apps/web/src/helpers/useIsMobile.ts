import { useSyncExternalStore } from "react";

// The prototypes switch to the phone layout below 600 px.
const phoneQuery = "(max-width: 600px)";

const subscribe = (onChange: () => void) => {
  const query = globalThis.matchMedia(phoneQuery);

  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
};

export const useIsMobile = () =>
  useSyncExternalStore(
    subscribe,
    () => globalThis.matchMedia(phoneQuery).matches,
    () => false,
  );
