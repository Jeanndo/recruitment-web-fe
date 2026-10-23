"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";

import { JobForm } from "@/components/admin/job-form";
import { useAdminJob } from "@/hooks/use-admin-job";

function FormSkeleton() {
  return (
    <div className="space-y-5">
      <div className="h-4 w-20 animate-pulse rounded bg-muted" />
      <div className="h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="h-56 animate-pulse rounded-2xl bg-muted/60" />
      <div className="h-72 animate-pulse rounded-2xl bg-muted/60" />
    </div>
  );
}

function EditJobInner() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const jobId = Number(params?.id);
  const job = useAdminJob(jobId);

  if (job.isLoading) {
    return <FormSkeleton />;
  }

  if (job.isError || !job.data) {
    const isNotFound =
      job.error &&
      typeof job.error === "object" &&
      "status" in job.error &&
      job.error.status === 404;

    return (
      <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <AlertCircle
          aria-hidden="true"
          className="mx-auto size-8 text-muted-foreground"
        />
        <h1 className="mt-3 text-xl font-semibold tracking-tight">
          {isNotFound ? "Role not found" : "Could not load this role"}
        </h1>
        <p className="mx-auto mt-1 max-w-sm text-sm text-muted-foreground">
          {job.error instanceof Error
            ? job.error.message
            : "Check the API and try again."}
        </p>
        <div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => void job.refetch()}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            {job.isFetching ? (
              <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            ) : null}
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

  return (
    <JobForm
      job={job.data}
      notice={
        searchParams.get("created") === "1"
          ? "Role created. Review the listing below before publishing."
          : undefined
      }
    />
  );
}

export function EditJobPageContent() {
  return (
    <Suspense fallback={<FormSkeleton />}>
      <EditJobInner />
    </Suspense>
  );
}
