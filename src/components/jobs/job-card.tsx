"use client";

import { MapPin, ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/format";
import type { JobListItem } from "@/types/api";

/** The card links to the job detail page. */
export function JobCard({ job }: { job: JobListItem }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/50 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:outline-none"
    >
      <div className="flex items-center justify-between gap-4">
        <Badge
          variant="secondary"
          className="bg-accent text-primary hover:bg-accent"
        >
          {job.employment_type}
        </Badge>
        <ArrowUpRight
          aria-hidden="true"
          className="size-5 text-muted-foreground transition-colors group-hover:text-primary"
        />
      </div>

      <h3 className="mt-5 text-xl font-semibold tracking-tight text-balance transition-colors group-hover:text-primary">
        {job.title}
      </h3>

      <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin aria-hidden="true" className="size-4 shrink-0" />
        {job.location}
      </p>

      <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
        {job.summary}
      </p>

      <div className="mt-auto flex items-center justify-between gap-4 border-t border-border pt-4 text-xs">
        <span className="text-muted-foreground">
          Closes {formatDate(job.closing_date)}
        </span>
        <span className="font-medium text-primary">View role</span>
      </div>
    </Link>
  );
}
