"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { initials } from "@/lib/format";

function pageTitle(pathname: string) {
  if (pathname.endsWith("/applications")) return "Applications";
  if (pathname.startsWith("/admin/jobs")) return "Jobs";
  return "Overview";
}

export function AdminTopbar({ onMenuOpen }: { onMenuOpen: () => void }) {
  const pathname = usePathname();
  const title = pageTitle(pathname);

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:px-6 lg:px-8">
      <button
        type="button"
        onClick={onMenuOpen}
        aria-label="Open admin menu"
        className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-muted lg:hidden"
      >
        <Menu aria-hidden="true" className="size-4" />
      </button>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold">{title}</p>
        <p className="hidden text-xs text-muted-foreground sm:block">
          BrightCore recruiting workspace
        </p>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">

        <ThemeToggle className="size-9" />

        <div className="hidden items-center gap-2 border-l border-border pl-3 sm:flex">
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground"
          >
            {initials("Aline Mukamana")}
          </span>
          <div className="hidden lg:block">
            <p className="text-xs font-medium">Aline Mukamana</p>
            <p className="text-[11px] text-muted-foreground">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
