"use client";

import type { FormEvent } from "react";
import { Search, X } from "lucide-react";

import { JobFilters } from "@/components/jobs/job-filters";
import { useJobSearch } from "@/hooks/use-job-search";
import { countLabel } from "@/lib/format";
import { scrollToId } from "@/lib/scroll";
import { cn } from "@/lib/utils";
import { useJobsStore } from "@/stores/jobs-store";

/**
 * The big search at the top of the page.
 * submitting the form simply moves the visitor to the results.
 */
export function SearchPanel({ className }: { className?: string }) {
  const search = useJobsStore((state) => state.search);
  const setSearch = useJobsStore((state) => state.setSearch);
  const clearFilters = useJobsStore((state) => state.clearFilters);
  const { total, hasFilters } = useJobSearch();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    scrollToId("open-roles");
  }

  return (
    <form
      role="search"
      onSubmit={handleSubmit}
      className={cn(
        "rounded-2xl border border-border/60 bg-card p-4 sm:p-5",
        className,
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground"
          />
          <label htmlFor="role-search" className="sr-only">
            Search open roles
          </label>
          <input
            id="role-search"
            name="search"
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by role, location, or keyword"
            className="h-12 w-full rounded-xl border border-border/60 bg-background pr-10 pl-12 text-base text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {search ? (
            <button
              type="button"
              onClick={() => setSearch("")}
              aria-label="Clear search"
              className="absolute top-1/2 right-2 inline-flex size-8 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          ) : null}
        </div>

        <button
          type="submit"
          className="inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-primary px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 sm:w-auto"
        >
          Search jobs
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">
        <JobFilters />

        {hasFilters ? (
          <button
            type="button"
            onClick={clearFilters}
            className="self-start text-sm font-medium text-primary underline-offset-4 hover:underline sm:self-auto"
          >
            Clear filters
          </button>
        ) : null}
      </div>

      <p aria-live="polite" className="mt-3 text-xs text-muted-foreground">
        {hasFilters
          ? `${countLabel(total, "role matches", "roles match")} your filters`
          : `${countLabel(total, "role is", "roles are")} open right now`}
      </p>
    </form>
  );
}
