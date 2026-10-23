"use client";

import { useEffect } from "react";
import { Moon, Sun } from "lucide-react";

import { cn } from "@/lib/utils";
import { useThemeStore } from "@/stores/theme-store";

/** Light/dark switch used by both the public header and the admin top bar. */
export function ThemeToggle({ className }: { className?: string }) {
  const hydrate = useThemeStore((state) => state.hydrate);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Toggle colour theme"
      title="Toggle colour theme"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-lg border border-border bg-background text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
        className,
      )}
    >
      <Moon aria-hidden="true" className="size-4 dark:hidden" />
      <Sun aria-hidden="true" className="hidden size-4 dark:block" />
    </button>
  );
}
