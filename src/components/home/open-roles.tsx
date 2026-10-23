"use client";

import { SearchX } from "lucide-react";

import { JobCard } from "@/components/jobs/job-card";
import { JobPagination } from "@/components/jobs/job-pagination";
import { Container } from "@/components/layout/container";
import { useJobSearch } from "@/hooks/use-job-search";
import { countLabel } from "@/lib/format";
import { useJobsStore } from "@/stores/jobs-store";

export function OpenRoles() {
  const { jobs, total, totalPages, page, pageSize, hasFilters } =
    useJobSearch();
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
            {hasFilters
              ? `${countLabel(total, "role matches", "roles match")} your filters.`
              : `${countLabel(total, "role is", "roles are")} open right now.`}
          </p>
        </div>

        {jobs.length > 0 ? (
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
              No roles match your search
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Try a different keyword or remove the employment type filter to
              see every open role.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 inline-flex h-10 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Clear filters
            </button>
          </div>
        )}

        <JobPagination
          page={page}
          totalPages={totalPages}
          total={total}
          pageSize={pageSize}
        />
      </Container>
    </section>
  );
}
