"use client";

import { Suspense, useDeferredValue, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  ArrowUpRight,
  Check,
  Download,
  Inbox,
  Loader2,
  Pencil,
  Search,
  SearchX,
  X,
} from "lucide-react";
import { toast } from "react-toastify";

import { ApplicationDetailSheet } from "@/components/admin/application-detail-sheet";
import {
  ApplicationStatusBadge,
  JobStatusBadge,
} from "@/components/admin/status-badge";
import { Pagination } from "@/components/ui/pagination";
import { useDownloadCv, useUpdateApplicationStatus } from "@/hooks/use-application-review";
import { useJobApplications } from "@/hooks/use-job-applications";
import { formatDate, formatDateTime, initials } from "@/lib/format";
import { cn } from "@/lib/utils";
import type {
  AdminApplicationItem,
  ApplicationFilter,
  ApplicationStatus,
} from "@/types/admin";

const filters: ApplicationFilter[] = [
  "All",
  "Pending",
  "Accepted",
  "Rejected",
];

function PageSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-4 w-16 animate-pulse rounded bg-muted" />
      <div className="h-9 w-72 animate-pulse rounded bg-muted" />
      <div className="h-20 animate-pulse rounded-2xl bg-muted/60" />
      <div className="h-72 animate-pulse rounded-2xl bg-muted/60" />
    </div>
  );
}

function JobApplicationsInner() {
  const params = useParams<{ id: string }>();
  const jobId = Number(params?.id);
  const [status, setStatus] = useState<ApplicationFilter>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const deferredSearch = useDeferredValue(search);

  const {
    job,
    applications,
    total,
    totalPages,
    page: currentPage,
    pageSize,
    counts,
    hasApplications,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useJobApplications({
    jobId,
    status,
    search: deferredSearch,
    page,
  });

  const updateStatus = useUpdateApplicationStatus();
  const download = useDownloadCv();

  function changeStatus(
    application: AdminApplicationItem,
    nextStatus: ApplicationStatus,
  ) {
    updateStatus.mutate(
      { id: application.id, status: nextStatus },
      {
        onSuccess: () => {
          toast.success(
            `${application.full_name} was ${nextStatus.toLowerCase()}.`,
          );
        },
        onError: (mutationError) => {
          toast.error(
            mutationError instanceof Error
              ? mutationError.message
              : "The review could not be saved.",
          );
        },
      },
    );
  }

  function downloadCv(application: AdminApplicationItem) {
    download.mutate(application, {
      onSuccess: (filename) => {
        toast.success(`Downloaded ${filename}.`);
      },
      onError: (mutationError) => {
        toast.error(
          mutationError instanceof Error
            ? mutationError.message
            : "The CV could not be downloaded.",
        );
      },
    });
  }

  function clearFilters() {
    setStatus("All");
    setSearch("");
    setPage(1);
  }

  if (isLoading) {
    return <PageSkeleton />;
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <AlertCircle
          aria-hidden="true"
          className="mx-auto size-8 text-destructive"
        />
        <h1 className="mt-3 text-xl font-semibold tracking-tight">
          Could not load applications
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          {error instanceof Error
            ? error.message
            : "Check the API and try again."}
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void refetch()}
            className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Try again
          </button>
          <Link
            href="/admin/jobs"
            className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to jobs
          </Link>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <Inbox
          aria-hidden="true"
          className="mx-auto size-8 text-muted-foreground"
        />
        <h1 className="mt-3 text-xl font-semibold tracking-tight">
          Role not found
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          This role is not part of the workspace, or it may have been removed.
        </p>
        <Link
          href="/admin/jobs"
          className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to jobs
        </Link>
      </div>
    );
  }

  const filterCounts: Record<ApplicationFilter, number> = {
    All: counts.total,
    Pending: counts.pending,
    Accepted: counts.accepted,
    Rejected: counts.rejected,
  };
  const isChanging = (application: AdminApplicationItem) =>
    updateStatus.isPending && updateStatus.variables?.id === application.id;
  const isDownloading = (application: AdminApplicationItem) =>
    download.isPending && download.variables?.id === application.id;
  const hasFilters = status !== "All" || deferredSearch.trim() !== "";

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          All jobs
        </Link>

        <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {job.title}
              </h1>
              <JobStatusBadge status={job.status} />
            </div>
            <p className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>{job.location}</span>
              <span aria-hidden="true">·</span>
              <span>Closes {formatDate(job.closing_date)}</span>
            </p>
          </div>

          <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
            <div className="grid shrink-0 grid-cols-4 divide-x divide-border rounded-xl border border-border bg-card py-2.5 shadow-sm">
              <SummaryCount label="Total" value={counts.total} />
              <SummaryCount label="Pending" value={counts.pending} />
              <SummaryCount label="Accepted" value={counts.accepted} />
              <SummaryCount label="Rejected" value={counts.rejected} />
            </div>
            <Link
              href={`/admin/jobs/${job.job_id}/edit`}
              className="inline-flex h-9 shrink-0 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              <Pencil aria-hidden="true" className="size-4" />
              Edit role
            </Link>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-card p-3 shadow-sm sm:p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            className="flex flex-wrap gap-1 rounded-lg bg-muted p-1"
            role="group"
            aria-label="Filter applications by status"
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
                  {filterCounts[filter]}
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
              placeholder="Search name or email…"
              aria-label="Search applications by name or email"
              className="h-10 w-full rounded-lg border border-border bg-background pr-3 pl-9 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none"
            />
          </div>
        </div>
      </div>

      <section
        className={cn(
          "overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-opacity",
          isFetching && "opacity-60",
        )}
      >
        {applications.length > 0 ? (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="w-full min-w-[760px] text-left text-sm">
                <thead className="border-b border-border bg-muted/40 text-xs text-muted-foreground">
                  <tr>
                    <th scope="col" className="px-5 py-3 font-medium">
                      Candidate
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Applied
                    </th>
                    <th scope="col" className="px-4 py-3 font-medium">
                      Status
                    </th>
                    <th scope="col" className="px-4 py-3 text-center font-medium">
                      CV
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {applications.map((application) => (
                    <tr key={application.id} className="hover:bg-muted/30">
                      <td className="px-5 py-3.5">
                        <button
                          type="button"
                          onClick={() => setSelectedId(application.id)}
                          className="flex items-center gap-3 text-left"
                        >
                          <span
                            aria-hidden="true"
                            className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary"
                          >
                            {initials(application.full_name)}
                          </span>
                          <span className="min-w-0">
                            <span className="block truncate font-medium hover:underline">
                              {application.full_name}
                            </span>
                            <span className="block max-w-[15rem] truncate text-xs text-muted-foreground">
                              {application.email}
                            </span>
                          </span>
                        </button>
                      </td>
                      <td className="px-4 py-3.5 text-xs text-muted-foreground">
                        {formatDateTime(application.created_at)}
                      </td>
                      <td className="px-4 py-3.5">
                        <ApplicationStatusBadge status={application.status} />
                      </td>
                      <td className="px-4 py-3.5 text-center">
                        <button
                          type="button"
                          onClick={() => downloadCv(application)}
                          disabled={
                            !application.cv_available || isDownloading(application)
                          }
                          aria-label={`Download CV for ${application.full_name}`}
                          title={
                            application.cv_available
                              ? "Download CV"
                              : "No CV attached"
                          }
                          className="inline-flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                        >
                          {isDownloading(application) ? (
                            <Loader2
                              aria-hidden="true"
                              className="size-4 animate-spin"
                            />
                          ) : (
                            <Download aria-hidden="true" className="size-4" />
                          )}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          {application.status !== "Accepted" ? (
                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(application, "Accepted")
                              }
                              disabled={isChanging(application)}
                              aria-label={`Accept ${application.full_name}`}
                              title="Accept application"
                              className="inline-flex size-8 items-center justify-center rounded-lg text-emerald-700 transition-colors hover:bg-emerald-500/10 disabled:pointer-events-none disabled:opacity-40 dark:text-emerald-300"
                            >
                              {isChanging(application) ? (
                                <Loader2
                                  aria-hidden="true"
                                  className="size-4 animate-spin"
                                />
                              ) : (
                                <Check aria-hidden="true" className="size-4" />
                              )}
                            </button>
                          ) : null}
                          {application.status !== "Rejected" ? (
                            <button
                              type="button"
                              onClick={() =>
                                changeStatus(application, "Rejected")
                              }
                              disabled={isChanging(application)}
                              aria-label={`Reject ${application.full_name}`}
                              title="Reject application"
                              className="inline-flex size-8 items-center justify-center rounded-lg text-rose-700 transition-colors hover:bg-rose-500/10 disabled:pointer-events-none disabled:opacity-40 dark:text-rose-300"
                            >
                              <X aria-hidden="true" className="size-4" />
                            </button>
                          ) : null}
                          <button
                            type="button"
                            onClick={() => setSelectedId(application.id)}
                            aria-label={`Review ${application.full_name}`}
                            title="Review application"
                            className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                          >
                            <ArrowUpRight
                              aria-hidden="true"
                              className="size-4"
                            />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {applications.map((application) => (
                <li key={application.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedId(application.id)}
                      className="flex min-w-0 flex-1 items-start gap-3 text-left"
                    >
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-accent text-xs font-semibold text-primary"
                      >
                        {initials(application.full_name)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate font-medium">
                          {application.full_name}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {application.email}
                        </span>
                      </span>
                    </button>
                    <ApplicationStatusBadge
                      status={application.status}
                      className="shrink-0"
                    />
                  </div>

                  <p className="mt-2 pl-12 text-xs text-muted-foreground">
                    Applied {formatDateTime(application.created_at)}
                  </p>

                  <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() => downloadCv(application)}
                      disabled={
                        !application.cv_available || isDownloading(application)
                      }
                      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-40"
                    >
                      {isDownloading(application) ? (
                        <Loader2
                          aria-hidden="true"
                          className="size-3.5 animate-spin"
                        />
                      ) : (
                        <Download aria-hidden="true" className="size-3.5" />
                      )}
                      CV
                    </button>
                    {application.status !== "Accepted" ? (
                      <button
                        type="button"
                        onClick={() => changeStatus(application, "Accepted")}
                        disabled={isChanging(application)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-primary px-2.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-40"
                      >
                        {isChanging(application) ? (
                          <Loader2
                            aria-hidden="true"
                            className="size-3.5 animate-spin"
                          />
                        ) : (
                          <Check aria-hidden="true" className="size-3.5" />
                        )}
                        Accept
                      </button>
                    ) : null}
                    {application.status !== "Rejected" ? (
                      <button
                        type="button"
                        onClick={() => changeStatus(application, "Rejected")}
                        disabled={isChanging(application)}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-rose-500/30 px-2.5 text-xs font-medium text-rose-700 transition-colors hover:bg-rose-500/10 disabled:pointer-events-none disabled:opacity-40 dark:text-rose-300"
                      >
                        <X aria-hidden="true" className="size-3.5" />
                        Reject
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setSelectedId(application.id)}
                      className="ml-auto inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs font-medium text-primary transition-colors hover:bg-muted"
                    >
                      Review
                      <ArrowUpRight aria-hidden="true" className="size-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="px-6 py-14 text-center">
            {hasApplications ? (
              <SearchX
                aria-hidden="true"
                className="mx-auto size-8 text-muted-foreground"
              />
            ) : (
              <Inbox
                aria-hidden="true"
                className="mx-auto size-8 text-muted-foreground"
              />
            )}
            <h2 className="mt-3 text-lg font-semibold tracking-tight">
              {hasApplications
                ? "No applications match"
                : "No applications yet"}
            </h2>
            <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
              {hasApplications
                ? "Try another status or a different search term."
                : "Applications for this role will appear here as candidates apply."}
            </p>
            {hasFilters && hasApplications ? (
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
        itemsLabel="applications"
        ariaLabel="Application pages"
      />

      <ApplicationDetailSheet
        applicationId={selectedId}
        open={selectedId !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedId(null);
        }}
      />
    </div>
  );
}

function SummaryCount({ label, value }: { label: string; value: number }) {
  return (
    <div className="min-w-16 px-3 text-center sm:min-w-20 sm:px-4">
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
        {label}
      </p>
    </div>
  );
}

export function JobApplications() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <JobApplicationsInner />
    </Suspense>
  );
}
