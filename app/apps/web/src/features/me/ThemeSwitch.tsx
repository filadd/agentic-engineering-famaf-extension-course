import { useLocalUi } from "../../helpers/local-ui/useLocalUi.ts";
import { Icon } from "../../ui/Icon.tsx";
import { Switch } from "../../ui/Switch.tsx";

export const ThemeSwitch = () => {
  const [theme, setTheme] = useLocalUi("kurasu:theme");

  return (
    <button
      type="button"
      role="switch"
      aria-checked={theme === "dark"}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="flex w-full items-center justify-between rounded-[10px] px-1.5 py-2 text-ink max-[600px]:py-[11px]"
    >
      <span className="inline-flex items-center gap-2.5">
        <Icon name="moon" size={18} />
        Modo oscuro
      </span>
      <Switch on={theme === "dark"} />
    </button>
  );
};
