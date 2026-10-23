"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

function pageItems(current: number, total: number): (number | "gap")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1);
  }

  const visible = new Set([1, total, current - 1, current, current + 1]);
  const pages = [...visible]
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const items: (number | "gap")[] = [];
  pages.forEach((page, index) => {
    if (index > 0 && page - pages[index - 1] > 1) {
      items.push("gap");
    }
    items.push(page);
  });

  return items;
}

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  itemsLabel?: string;
  ariaLabel?: string;
  className?: string;
}

/** Shared numbered pagination for the public job board and the admin tables. */
export function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  onPageChange,
  itemsLabel = "results",
  ariaLabel = "Results pages",
  className,
}: PaginationProps) {
  if (total === 0 || totalPages <= 1) return null;

  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  function goTo(next: number) {
    if (next < 1 || next > totalPages || next === page) return;
    onPageChange(next);
  }

  const buttonBase =
    "inline-flex size-9 items-center justify-center rounded-lg border text-sm transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-40";

  return (
    <nav
      aria-label={ariaLabel}
      className={cn(
        "mt-6 flex flex-col items-center justify-between gap-4 border-t border-border pt-5 sm:flex-row",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-medium text-foreground">
          {from}–{to}
        </span>{" "}
        of <span className="font-medium text-foreground">{total}</span>{" "}
        {itemsLabel}
      </p>

      <div className="flex flex-wrap items-center justify-center gap-1.5">
        <button
          type="button"
          onClick={() => goTo(page - 1)}
          disabled={page === 1}
          className={cn(
            buttonBase,
            "border-border bg-background text-foreground hover:bg-muted",
          )}
          aria-label="Previous page"
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
        </button>

        {pageItems(page, totalPages).map((item, index) =>
          item === "gap" ? (
            <span
              key={`gap-${index}`}
              aria-hidden="true"
              className="px-1 text-sm text-muted-foreground"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => goTo(item)}
              aria-label={`Page ${item}`}
              aria-current={item === page ? "page" : undefined}
              className={cn(
                buttonBase,
                item === page
                  ? "border-primary bg-primary font-medium text-primary-foreground"
                  : "border-border bg-background text-foreground hover:bg-muted",
              )}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => goTo(page + 1)}
          disabled={page === totalPages}
          className={cn(
            buttonBase,
            "border-border bg-background text-foreground hover:bg-muted",
          )}
          aria-label="Next page"
        >
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </div>
    </nav>
  );
}
