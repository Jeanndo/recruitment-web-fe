"use client";

import { Suspense, useDeferredValue, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SearchX } from "lucide-react";

import { JobStatusBadge } from "@/components/admin/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { useAdminJobs } from "@/hooks/use-admin-jobs";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminJobFilter } from "@/types/admin";

const filters: AdminJobFilter[] = ["All", "Open", "Closed", "Draft"];

function AdminJobsInner() {
  const [status, setStatus] = useState<AdminJobFilter>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  const { jobs, total, totalPages, page: currentPage, pageSize, counts, hasFilters } =
    useAdminJobs({ status, search: deferredSearch, page });

  function clearFilters() {
    setStatus("All");
    setSearch("");
    setPage(1);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Jobs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {counts.All} roles across the workspace. Open a role to review its
          applications.
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-1 rounded-lg bg-muted p-1"
            role="group"
            aria-label="Filter jobs by status"
          >
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => {
                  setStatus(filter);
                  setPage(1);
                }}
                aria-pressed={status === filter}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md px-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40",
                  status === filter
                    ? "bg-background text-foreground shadow-sm ring-1 ring-border"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {filter}
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  {counts[filter]}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:max-w-xs">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              placeholder="Search roles or locations…"
              aria-label="Search roles or locations"
              className="h-10 w-full rounded-lg border border-border bg-background pr-3 pl-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none"
            />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {jobs.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Role
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Closing date
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Applications
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      <span className="sr-only">Open applications</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-muted/30">
                      <td className="px-5 py-4">
                        <p className="font-medium">{job.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {job.location}
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="px-4 py-4 text-sm text-muted-foreground">
                        {formatDate(job.closing_date)}
                      </td>
                      <td className="px-4 py-4 text-right font-medium tabular-nums">
                        {job.application_count}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <Link
                          href={`/admin/jobs/${job.id}/applications`}
                          className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                        >
                          View applications
                          <ArrowRight aria-hidden="true" className="size-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {jobs.map((job) => (
                <li key={job.id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium">{job.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {job.location}
                      </p>
                    </div>
                    <JobStatusBadge status={job.status} className="shrink-0" />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <span>Closes {formatDate(job.closing_date)}</span>
                    <span>
                      <span className="font-medium text-foreground">
                        {job.application_count}
                      </span>{" "}
                      applications
                    </span>
                  </div>

                  <Link
                    href={`/admin/jobs/${job.id}/applications`}
                    className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                  >
                    View applications
                    <ArrowRight aria-hidden="true" className="size-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="px-6 py-14 text-center">
            <SearchX
              aria-hidden="true"
              className="mx-auto size-8 text-muted-foreground"
            />
            <h2 className="mt-3 text-lg font-semibold tracking-tight">
              No roles found
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              Try another status or a different search term.
            </p>
            {hasFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Clear filters
              </button>
            ) : null}
          </div>
        )}
      </section>


      <Pagination
        page={currentPage}
        totalPages={totalPages}
        total={total}
        pageSize={pageSize}
        onPageChange={setPage}
        itemsLabel="jobs"
        ariaLabel="Job pages"
      />
    </div>
  );
}

export function AdminJobs() {
  return (
    <Suspense fallback={null}>
      <AdminJobsInner />
    </Suspense>
  );
}
