"use client";

import { AlertCircle, SearchX } from "lucide-react";

import { JobCard } from "@/components/jobs/job-card";
import { JobPagination } from "@/components/jobs/job-pagination";
import { Container } from "@/components/layout/container";
import { useJobSearch } from "@/hooks/use-job-search";
import { countLabel } from "@/lib/format";
import { useJobsStore } from "@/stores/jobs-store";

function JobCardSkeleton() {
  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card p-6">
      <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
      <div className="mt-5 h-6 w-3/4 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-4 w-1/3 animate-pulse rounded bg-muted" />
      <div className="mt-4 space-y-2">
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
      </div>
      <div className="mt-6 h-4 w-1/2 animate-pulse rounded border-t border-border bg-muted/60 pt-4" />
    </div>
  );
}

export function OpenRoles() {
  const {
    jobs,
    total,
    totalPages,
    page,
    pageSize,
    hasFilters,
    isLoading,
    isError,
    error,
    refetch,
  } = useJobSearch();
  const clearFilters = useJobsStore((state) => state.clearFilters);

  return (
    <section
      id="open-roles"
      className="scroll-mt-20 border-b border-border bg-background"
    >
      <Container className="py-14 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Open roles
          </h2>
          <p className="mt-2 text-muted-foreground">
            {isLoading
              ? "Loading the latest roles…"
              : hasFilters
                ? `${countLabel(total, "role matches", "roles match")} your filters.`
                : `${countLabel(total, "role is", "roles are")} open right now.`}
          </p>
        </div>

        {isError ? (
          <div
            role="alert"
            className="mx-auto mt-8 max-w-lg rounded-2xl border border-destructive/20 bg-destructive/10 px-6 py-10 text-center"
          >
            <AlertCircle
              aria-hidden="true"
              className="mx-auto size-8 text-destructive"
            />
            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              We couldn&apos;t load the open roles
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "The job board is unavailable right now. Please try again."}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        ) : isLoading ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <JobCardSkeleton key={index} />
            ))}
          </div>
        ) : jobs.length > 0 ? (
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {jobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-dashed border-border px-6 py-14 text-center">
            <SearchX
              aria-hidden="true"
              className="mx-auto size-8 text-muted-foreground"
            />
            <h3 className="mt-4 text-xl font-semibold tracking-tight">
              {hasFilters ? "No roles match your search" : "No open roles right now"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              {hasFilters
                ? "Try a different keyword or remove the employment type filter to see every open role."
                : "We are not hiring at the moment. Check back soon — new roles are added regularly."}
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}

        {!isLoading && !isError ? (
          <JobPagination
            page={page}
            totalPages={totalPages}
            total={total}
            pageSize={pageSize}
          />
        ) : null}
      </Container>
    </section>
  );
}
