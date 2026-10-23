"use client";

import { Suspense, useDeferredValue, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Lock,
  Pencil,
  Plus,
  Search,
  SearchX,
  X,
} from "lucide-react";

import { JobStatusBadge } from "@/components/admin/status-badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { Pagination } from "@/components/ui/pagination";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";
import { useCloseJob } from "@/hooks/use-admin-job-mutations";
import { useAdminJobs } from "@/hooks/use-admin-jobs";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminJobFilter, AdminJobListItem } from "@/types/admin";

const filters: AdminJobFilter[] = ["All", "Open", "Closed", "Draft"];

function SkeletonRows() {
  return (
    <div className="space-y-3 p-5">
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="flex animate-pulse items-center gap-4 rounded-lg bg-muted/50 p-4"
        >
          <div className="h-4 flex-1 rounded bg-muted" />
          <div className="h-6 w-16 rounded-full bg-muted" />
          <div className="h-4 w-24 rounded bg-muted" />
          <div className="h-4 w-10 rounded bg-muted" />
        </div>
      ))}
    </div>
  );
}

function AdminJobsInner() {
  const [status, setStatus] = useState<AdminJobFilter>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [feedback, setFeedback] = useState<{
    message: string;
    tone: "success" | "error";
  } | null>(null);
  const [jobToClose, setJobToClose] = useState<AdminJobListItem | null>(null);
  const deferredSearch = useDeferredValue(search);

  const {
    jobs,
    total,
    totalPages,
    page: currentPage,
    pageSize,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useAdminJobs({ status, search: deferredSearch, page });
  const dashboard = useAdminDashboard();
  const closeJob = useCloseJob();

  const counts: Record<AdminJobFilter, number> = {
    All: dashboard.data?.total_jobs ?? 0,
    Open: dashboard.data?.open_jobs ?? 0,
    Closed: dashboard.data?.closed_jobs ?? 0,
    Draft: dashboard.data?.draft_jobs ?? 0,
  };
  const hasFilters = status !== "All" || deferredSearch.trim() !== "";

  function clearFilters() {
    setStatus("All");
    setSearch("");
    setPage(1);
  }

  function confirmClose() {
    if (!jobToClose) return;

    closeJob.mutate(jobToClose.id, {
      onSuccess: (result) => {
        setFeedback({ message: result.message, tone: "success" });
        setJobToClose(null);
        setPage(1);
      },
      onError: (mutationError) => {
        setFeedback({
          message:
            mutationError instanceof Error
              ? mutationError.message
              : "The role could not be closed.",
          tone: "error",
        });
      },
    });
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {counts.All} roles across the workspace. Create, edit or close a
            role, then review its applications.
          </p>
        </div>
        <Link
          href="/admin/jobs/new"
          className="inline-flex h-10 shrink-0 items-center justify-center gap-1.5 self-start rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:self-auto"
        >
          <Plus aria-hidden="true" className="size-4" />
          New role
        </Link>
      </div>

      {feedback ? (
        <div
          role={feedback.tone === "error" ? "alert" : "status"}
          aria-live="polite"
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm",
            feedback.tone === "error"
              ? "border-destructive/20 bg-destructive/10 text-destructive"
              : "border-primary/20 bg-accent/60 text-foreground",
          )}
        >
          <span className="min-w-0 flex-1">{feedback.message}</span>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Dismiss message"
            className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
          >
            <X aria-hidden="true" className="size-3.5" />
          </button>
        </div>
      ) : null}

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

      <section
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-opacity",
          isFetching && !isLoading ? "opacity-60" : "",
        )}
      >
        {isLoading ? (
          <SkeletonRows />
        ) : isError ? (
          <div className="px-6 py-14 text-center">
            <AlertCircle
              aria-hidden="true"
              className="mx-auto size-8 text-destructive"
            />
            <h2 className="mt-3 text-lg font-semibold tracking-tight">
              Could not load roles
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              {error instanceof Error
                ? error.message
                : "Please check the API and try again."}
            </p>
            <button
              type="button"
              onClick={() => void refetch()}
              className="mt-4 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Try again
            </button>
          </div>
        ) : jobs.length > 0 ? (
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
                      Actions
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
                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center justify-end gap-2">
                          <Link
                            href={`/admin/jobs/${job.id}/applications`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            Applications
                            <ArrowRight
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          </Link>
                          <Link
                            href={`/admin/jobs/${job.id}/edit`}
                            aria-label={`Edit ${job.title}`}
                            title="Edit role"
                            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <Pencil aria-hidden="true" className="size-4" />
                          </Link>
                          {job.status === "Open" ? (
                            <button
                              type="button"
                              onClick={() => setJobToClose(job)}
                              aria-label={`Close ${job.title}`}
                              title="Close role"
                              className="inline-flex size-8 items-center justify-center rounded-lg text-rose-700 transition-colors hover:bg-rose-500/10 dark:text-rose-300"
                            >
                              <Lock aria-hidden="true" className="size-4" />
                            </button>
                          ) : null}
                        </div>
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

                  <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
                    <Link
                      href={`/admin/jobs/${job.id}/applications`}
                      className="inline-flex h-8 items-center gap-1 rounded-lg bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      Applications
                      <ArrowRight aria-hidden="true" className="size-3.5" />
                    </Link>
                    <Link
                      href={`/admin/jobs/${job.id}/edit`}
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <Pencil aria-hidden="true" className="size-3.5" />
                      Edit
                    </Link>
                    {job.status === "Open" ? (
                      <button
                        type="button"
                        onClick={() => setJobToClose(job)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/30 px-2.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-500/10 dark:text-rose-300"
                      >
                        <Lock aria-hidden="true" className="size-3.5" />
                        Close
                      </button>
                    ) : null}
                  </div>
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
            ) : (
              <Link
                href="/admin/jobs/new"
                className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                <Plus aria-hidden="true" className="size-4" />
                Create the first role
              </Link>
            )}
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

      <ConfirmDialog
        open={jobToClose !== null}
        onOpenChange={(open) => {
          if (!open) {
            setJobToClose(null);
            closeJob.reset();
          }
        }}
        title={`Close ${jobToClose?.title ?? "this role"}?`}
        description="The role will stop accepting applications immediately. Existing applications and CVs are kept for review, and the role can be reopened later."
        confirmLabel="Close role"
        pendingLabel="Closing…"
        destructive
        isPending={closeJob.isPending}
        error={
          closeJob.error instanceof Error ? closeJob.error.message : null
        }
        onConfirm={confirmClose}
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
