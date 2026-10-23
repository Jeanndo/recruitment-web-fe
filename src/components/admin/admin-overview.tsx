"use client";

import Link from "next/link";
import {
  Archive,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  Clock,
  Plus,
  Users,
  XCircle,
} from "lucide-react";

import { JobStatusBadge } from "@/components/admin/status-badge";
import { StatCard } from "@/components/admin/stat-card";
import { useAdminDashboard } from "@/hooks/use-admin-dashboard";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

function percent(value: number, total: number) {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

function OverviewSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 animate-pulse rounded bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="h-32 animate-pulse rounded-2xl bg-muted/60"
          />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="h-80 animate-pulse rounded-2xl bg-muted/60" />
        <div className="h-80 animate-pulse rounded-2xl bg-muted/60 xl:col-span-2" />
      </div>
      <div className="h-72 animate-pulse rounded-2xl bg-muted/60" />
    </div>
  );
}

export function AdminOverview() {
  const dashboard = useAdminDashboard();

  if (dashboard.isLoading) {
    return <OverviewSkeleton />;
  }

  if (dashboard.isError || !dashboard.data) {
    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <Briefcase
          aria-hidden="true"
          className="mx-auto size-8 text-muted-foreground"
        />
        <h1 className="mt-3 text-xl font-semibold tracking-tight">
          Could not load the overview
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          {dashboard.error instanceof Error
            ? dashboard.error.message
            : "Check the BrightCore API and try again."}
        </p>
        <button
          type="button"
          onClick={() => void dashboard.refetch()}
          className="mt-5 inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    );
  }

  const summary = dashboard.data;
  const counts = summary.application_counts;
  const reviewed = counts.accepted + counts.rejected;
  const acceptanceRate = percent(counts.accepted, reviewed);
  const rejectionRate = percent(counts.rejected, reviewed);
  const overviewJobs = summary.jobs.slice(0, 6);
  const attentionJobs = summary.jobs
    .filter((job) => job.application_counts.pending > 0)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Overview
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            A snapshot of roles and applications across BrightCore.
          </p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Link
            href="/admin/jobs"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
          >
            View all jobs
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
          <Link
            href="/admin/jobs/new"
            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus aria-hidden="true" className="size-4" />
            New role
          </Link>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          label="Open roles"
          value={summary.open_jobs}
          hint={`${summary.draft_jobs} drafts waiting to be published`}
          icon={Briefcase}
        />
        <StatCard
          label="Closed roles"
          value={summary.closed_jobs}
          hint="Applications are kept after a role closes"
          icon={Archive}
          accent="neutral"
        />
        <StatCard
          label="Applications"
          value={counts.total}
          hint={`${summary.total_jobs} roles in the workspace`}
          icon={Users}
        />
        <StatCard
          label="Pending review"
          value={counts.pending}
          hint="Waiting for a first decision"
          icon={Clock}
          accent="amber"
        />
        <StatCard
          label="Accepted"
          value={counts.accepted}
          hint={`${acceptanceRate}% of reviewed applications`}
          icon={CheckCircle2}
          accent="green"
        />
        <StatCard
          label="Rejected"
          value={counts.rejected}
          hint={`${rejectionRate}% of reviewed applications`}
          icon={XCircle}
          accent="rose"
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold tracking-tight">Review pipeline</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Every application, by status
              </p>
            </div>
            <span className="text-2xl font-semibold tabular-nums">
              {counts.total}
            </span>
          </div>

          <div
            className="mt-5 flex h-2.5 overflow-hidden rounded-full bg-muted"
            role="img"
            aria-label={`${counts.pending} pending, ${counts.accepted} accepted, ${counts.rejected} rejected`}
          >
            {counts.pending > 0 ? (
              <span
                className="bg-amber-500"
                style={{ width: `${percent(counts.pending, counts.total)}%` }}
              />
            ) : null}
            {counts.accepted > 0 ? (
              <span
                className="bg-emerald-500"
                style={{ width: `${percent(counts.accepted, counts.total)}%` }}
              />
            ) : null}
            {counts.rejected > 0 ? (
              <span
                className="bg-rose-500"
                style={{ width: `${percent(counts.rejected, counts.total)}%` }}
              />
            ) : null}
          </div>

          <ul className="mt-5 space-y-3">
            <PipelineRow
              label="Pending"
              count={counts.pending}
              total={counts.total}
              dot="bg-amber-500"
            />
            <PipelineRow
              label="Accepted"
              count={counts.accepted}
              total={counts.total}
              dot="bg-emerald-500"
            />
            <PipelineRow
              label="Rejected"
              count={counts.rejected}
              total={counts.total}
              dot="bg-rose-500"
            />
          </ul>

          <p className="mt-5 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            {counts.pending > 0
              ? `${counts.pending} application${counts.pending === 1 ? "" : "s"} still need a decision.`
              : "Every application has been reviewed."}
          </p>
        </section>

        <section className="rounded-2xl border border-border bg-card shadow-sm xl:col-span-2">
          <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
            <div>
              <h2 className="font-semibold tracking-tight">Needs attention</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Roles with applications waiting for a decision
              </p>
            </div>
            <Link
              href="/admin/jobs"
              className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
            >
              Browse jobs
              <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>

          {attentionJobs.length > 0 ? (
            <ul className="divide-y divide-border">
              {attentionJobs.map((job) => (
                <li key={job.job_id}>
                  <Link
                    href={`/admin/jobs/${job.job_id}/applications`}
                    className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-muted/50 sm:px-5"
                  >
                    <span
                      aria-hidden="true"
                      className="grid size-9 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-sm font-semibold text-amber-700 tabular-nums dark:text-amber-300"
                    >
                      {job.application_counts.pending}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{job.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {job.location} · {job.application_counts.total} total
                      </p>
                    </div>
                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                      <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
                        {job.application_counts.accepted} accepted
                      </span>
                      <span className="rounded-full bg-muted px-2 py-1 text-[11px] font-medium text-muted-foreground tabular-nums">
                        {job.application_counts.rejected} rejected
                      </span>
                    </div>
                    <JobStatusBadge status={job.status} className="shrink-0" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-5 py-12 text-center">
              <CheckCircle2
                aria-hidden="true"
                className="mx-auto size-8 text-emerald-600 dark:text-emerald-400"
              />
              <p className="mt-3 text-sm font-medium">
                The review queue is clear
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                New applications will show up here as candidates apply.
              </p>
            </div>
          )}
        </section>
      </div>

      <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex items-start justify-between gap-3 border-b border-border px-5 py-4">
          <div>
            <h2 className="font-semibold tracking-tight">Jobs overview</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Applications per role, broken down by review status
            </p>
          </div>
          <Link
            href="/admin/jobs"
            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
          >
            All jobs
            <ArrowRight aria-hidden="true" className="size-3.5" />
          </Link>
        </div>

        {overviewJobs.length > 0 ? (
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
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Total
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Pending
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Accepted
                    </th>
                    <th scope="col" className="px-4 py-3 text-right font-medium">
                      Rejected
                    </th>
                    <th scope="col" className="px-5 py-3 text-right font-medium">
                      <span className="sr-only">Open applications</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {overviewJobs.map((job) => (
                    <tr key={job.job_id} className="hover:bg-muted/30">
                      <td className="px-5 py-3.5">
                        <p className="font-medium">{job.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {job.location} · closes {formatDate(job.closing_date)}
                        </p>
                      </td>
                      <td className="px-4 py-3.5">
                        <JobStatusBadge status={job.status} />
                      </td>
                      <td className="px-4 py-3.5 text-right font-medium tabular-nums">
                        {job.application_counts.total}
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums">
                        {job.application_counts.pending}
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums">
                        {job.application_counts.accepted}
                      </td>
                      <td className="px-4 py-3.5 text-right tabular-nums">
                        {job.application_counts.rejected}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/jobs/${job.job_id}/applications`}
                            className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                          >
                            View
                            <ArrowRight
                              aria-hidden="true"
                              className="size-3.5"
                            />
                          </Link>
                          <Link
                            href={`/admin/jobs/${job.job_id}/edit`}
                            className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                          >
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-border md:hidden">
              {overviewJobs.map((job) => (
                <li key={job.job_id} className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="truncate font-medium">{job.title}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {job.location}
                      </p>
                    </div>
                    <JobStatusBadge status={job.status} className="shrink-0" />
                  </div>
                  <div className="mt-3 grid grid-cols-4 gap-2 rounded-lg bg-muted/50 p-2.5 text-center">
                    <MiniCount
                      label="Total"
                      value={job.application_counts.total}
                    />
                    <MiniCount
                      label="Pending"
                      value={job.application_counts.pending}
                    />
                    <MiniCount
                      label="Accepted"
                      value={job.application_counts.accepted}
                    />
                    <MiniCount
                      label="Rejected"
                      value={job.application_counts.rejected}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-3">
                    <Link
                      href={`/admin/jobs/${job.job_id}/applications`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      View applications
                      <ArrowRight aria-hidden="true" className="size-3.5" />
                    </Link>
                    <Link
                      href={`/admin/jobs/${job.job_id}/edit`}
                      className="text-xs font-medium text-muted-foreground hover:text-foreground hover:underline"
                    >
                      Edit role
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              No roles have been created yet.
            </p>
            <Link
              href="/admin/jobs/new"
              className="mt-4 inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Plus aria-hidden="true" className="size-4" />
              Create the first role
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}

function PipelineRow({
  label,
  count,
  total,
  dot,
}: {
  label: string;
  count: number;
  total: number;
  dot: string;
}) {
  return (
    <li className="flex items-center gap-2.5 text-sm">
      <span aria-hidden="true" className={cn("size-2 rounded-full", dot)} />
      <span className="text-muted-foreground">{label}</span>
      <span className="ml-auto font-medium tabular-nums">{count}</span>
      <span className="w-9 text-right text-xs text-muted-foreground tabular-nums">
        {percent(count, total)}%
      </span>
    </li>
  );
}

function MiniCount({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className="text-sm font-semibold tabular-nums">{value}</p>
      <p className="text-[10px] text-muted-foreground">{label}</p>
    </div>
  );
}
