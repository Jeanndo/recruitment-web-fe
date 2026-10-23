"use client";

import { cn } from "@/lib/utils";
import {
  EMPLOYMENT_FILTERS,
  useJobsStore,
  type EmploymentFilter,
} from "@/stores/jobs-store";

/** Employment-type chips, shared by the hero search and the results header. */
export function JobFilters({ className }: { className?: string }) {
  const employmentType = useJobsStore((state) => state.employmentType);
  const setEmploymentType = useJobsStore((state) => state.setEmploymentType);

  return (
    <div
      role="group"
      aria-label="Filter by employment type"
      className={cn("flex flex-wrap items-center gap-2", className)}
    >
      {EMPLOYMENT_FILTERS.map((filter: EmploymentFilter) => {
        const active = employmentType === filter;

        return (
          <button
            key={filter}
            type="button"
            aria-pressed={active}
            onClick={() => setEmploymentType(filter)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:border-primary/40 hover:text-primary",
            )}
          >
            {filter === "All" ? "All roles" : filter}
          </button>
        );
      })}
    </div>
  );
}
