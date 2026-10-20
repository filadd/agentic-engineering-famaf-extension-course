import { useEffect } from "react";

import { useLocalUi } from "./useLocalUi.ts";

export const useThemeClass = () => {
  const [theme] = useLocalUi("kurasu:theme");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);
};
