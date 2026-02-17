"use client";

import * as React from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  return (
    <Button
      // Changed to outline to ensure it's always visible
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      // Added bg-secondary/50 and border-border to match your Auth card style
      className="rounded-full bg-secondary/50 border-border hover:bg-secondary transition-all shadow-sm"
    >
      {theme === "light" ? (
        <IconMoon className="h-[1.2rem] w-[1.2rem] text-foreground" />
      ) : (
        <IconSun className="h-[1.2rem] w-[1.2rem] text-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}