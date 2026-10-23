"use client";

import { useMemo } from "react";

import { useAdminStore } from "@/stores/admin-store";
import {
  emptyStatusCounts,
  type AdminApplicationDetail,
  type AdminJobListItem,
  type ApplicationStatusCounts,
  type DashboardResponse,
  type JobDashboardSummary,
} from "@/types/admin";

export interface DashboardJob extends JobDashboardSummary {
  location: string;
  closing_date: string;
  application_count: number;
}

export interface DashboardData {
  summary: DashboardResponse;
  jobs: DashboardJob[];
  recentApplications: AdminApplicationDetail[];
}

function countStatuses(
  applications: AdminApplicationDetail[],
): ApplicationStatusCounts {
  const counts = emptyStatusCounts();

  for (const application of applications) {
    counts.total += 1;
    if (application.status === "Pending") counts.pending += 1;
    if (application.status === "Accepted") counts.accepted += 1;
    if (application.status === "Rejected") counts.rejected += 1;
  }

  return counts;
}

/**
 * The dashboard's single data source. In phase two this becomes a React Query
 * call to `GET /api/v1/admin/dashboard`.
 */
export function useAdminDashboard(): DashboardData {
  const jobs = useAdminStore((state) => state.jobs);
  const applications = useAdminStore((state) => state.applications);

  return useMemo(() => {
    const applicationCounts = countStatuses(applications);

    const jobsWithCounts: DashboardJob[] = jobs.map((job: AdminJobListItem) => {
      const jobApplications = applications.filter(
        (application) => application.job_id === job.id,
      );

      return {
        job_id: job.id,
        title: job.title,
        location: job.location,
        status: job.status,
        closing_date: job.closing_date,
        application_count: jobApplications.length,
        application_counts: countStatuses(jobApplications),
      };
    });

    const orderedJobs = [...jobsWithCounts].sort((a, b) => {
      if (b.application_counts.pending !== a.application_counts.pending) {
        return b.application_counts.pending - a.application_counts.pending;
      }
      return b.application_count - a.application_count;
    });

    const recentApplications = [...applications]
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 6);

    return {
      summary: {
        total_jobs: jobs.length,
        open_jobs: jobs.filter((job) => job.status === "Open").length,
        closed_jobs: jobs.filter((job) => job.status === "Closed").length,
        draft_jobs: jobs.filter((job) => job.status === "Draft").length,
        total_applications: applications.length,
        application_counts: applicationCounts,
        jobs: orderedJobs,
      },
      jobs: orderedJobs,
      recentApplications,
    };
  }, [applications, jobs]);
}
