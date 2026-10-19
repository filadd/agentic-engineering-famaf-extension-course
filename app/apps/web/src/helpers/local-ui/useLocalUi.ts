import * as Option from "effect/Option";
import * as Schema from "effect/Schema";
import { useCallback, useSyncExternalStore } from "react";

import { localUi } from "./local-ui.ts";
import type { LocalUiKey, LocalUiValue } from "./local-ui.ts";

const changeEvent = "kurasu:local-ui";

const subscribe = (onChange: () => void) => {
  globalThis.addEventListener(changeEvent, onChange);
  globalThis.addEventListener("storage", onChange);

  return () => {
    globalThis.removeEventListener(changeEvent, onChange);
    globalThis.removeEventListener("storage", onChange);
  };
};

const parse = (raw: string | null) => {
  try {
    return raw == null ? undefined : JSON.parse(raw);
  } catch {
    return undefined;
  }
};

// useSyncExternalStore compares snapshots by identity, so the hook reads the
// raw string and decodes it afterwards.
export const useLocalUi = <K extends LocalUiKey>(key: K) => {
  const entry = localUi[key];

  const raw = useSyncExternalStore(
    subscribe,
    () => globalThis.localStorage.getItem(key),
    () => null,
  );

  const value: LocalUiValue<K> = Option.getOrElse(
    Schema.decodeUnknownOption(entry.schema)(parse(raw)),
    () => entry.fallback,
  );

  const set = useCallback(
    (next: LocalUiValue<K>) => {
      globalThis.localStorage.setItem(key, JSON.stringify(next));
      globalThis.dispatchEvent(new Event(changeEvent));
    },
    [key],
  );

  return [value, set] as const;
};
