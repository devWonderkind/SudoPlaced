"use client";

import React, { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-10 h-10" />;

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        relative flex items-center w-12 h-8 rounded-full
        backdrop-blur-md
        bg-secondary/40
        border border-border
        transition-all duration-300 ease-in-out
        shadow-[inset_0_3px_8px_rgba(0,0,0,0.25)]
        hover:shadow-[inset_0_3px_10px_rgba(0,0,0,0.35)]
      `}
    >
      <div
        className={`
          absolute top-1 left-1
          w-6 h-6 rounded-full
          bg-background
          border border-border
          flex items-center justify-center
          transition-all duration-300 ease-in-out
          shadow-md
          ${isDark ? "translate-x-4" : "translate-x-0"}
        `}
      >
        {isDark ? (
          <IconMoon className="w-4 h-4 text-foreground" />
        ) : (
          <IconSun className="w-4 h-4 text-foreground" />
        )}
      </div>
    </button>
  );
}