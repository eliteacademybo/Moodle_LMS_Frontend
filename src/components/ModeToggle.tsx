import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";

const THEME_KEY = "theme";

export function ModeToggle() {
  const [isDark, setIsDark] = React.useState(true);

  React.useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_KEY);

    const shouldUseDark = savedTheme === null ? true : savedTheme === "dark";

    document.documentElement.classList.toggle("dark", shouldUseDark);

    setIsDark(shouldUseDark);
  }, []);

  const toggleTheme = () => {
    const nextIsDark = !isDark;

    document.documentElement.classList.toggle("dark", nextIsDark);

    localStorage.setItem(THEME_KEY, nextIsDark ? "dark" : "light");

    setIsDark(nextIsDark);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}

      <span className="sr-only">Cambiar tema</span>
    </Button>
  );
}
