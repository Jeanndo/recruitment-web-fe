import { cn } from "@/lib/utils";
import type { JobStatus } from "@/types/api";
import type { ApplicationStatus } from "@/types/admin";

const jobStyles: Record<JobStatus, { label: string; className: string }> = {
  Open: {
    label: "Open",
    className:
      "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-400/25",
  },
  Closed: {
    label: "Closed",
    className:
      "bg-neutral-500/10 text-neutral-600 ring-neutral-500/20 dark:text-neutral-300 dark:ring-neutral-400/25",
  },
  Draft: {
    label: "Draft",
    className:
      "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300 dark:ring-amber-400/25",
  },
};

const applicationStyles: Record<
  ApplicationStatus,
  { label: string; dot: string; className: string }
> = {
  Pending: {
    label: "Pending",
    dot: "bg-amber-500",
    className:
      "bg-amber-500/10 text-amber-700 ring-amber-500/20 dark:text-amber-300 dark:ring-amber-400/25",
  },
  Accepted: {
    label: "Accepted",
    dot: "bg-emerald-500",
    className:
      "bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300 dark:ring-emerald-400/25",
  },
  Rejected: {
    label: "Rejected",
    dot: "bg-rose-500",
    className:
      "bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300 dark:ring-rose-400/25",
  },
};

export function JobStatusBadge({
  status,
  className,
}: {
  status: JobStatus;
  className?: string;
}) {
  const style = jobStyles[status];

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium ring-1 ring-inset",
        style.className,
        className,
      )}
    >
      {style.label}
    </span>
  );
}

export function ApplicationStatusBadge({
  status,
  className,
}: {
  status: ApplicationStatus;
  className?: string;
}) {
  const style = applicationStyles[status];

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium ring-1 ring-inset",
        style.className,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("size-1.5 rounded-full", style.dot)}
      />
      {style.label}
    </span>
  );
}
