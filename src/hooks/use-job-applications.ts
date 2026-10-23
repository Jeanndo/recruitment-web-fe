"use client";

import { useMemo } from "react";

import { useAdminStore } from "@/stores/admin-store";
import {
  emptyStatusCounts,
  type ApplicationFilter,
  type ApplicationStatusCounts,
} from "@/types/admin";

export interface JobApplicationsQuery {
  jobId: number;
  status: ApplicationFilter;
  search: string;
  page: number;
  pageSize?: number;
}

export function useJobApplications({
  jobId,
  status,
  search,
  page,
  pageSize = 8,
}: JobApplicationsQuery) {
  const jobs = useAdminStore((state) => state.jobs);
  const applications = useAdminStore((state) => state.applications);

  return useMemo(() => {
    const job = jobs.find((item) => item.id === jobId);
    const jobApplications = applications.filter(
      (application) => application.job_id === jobId,
    );

    const counts: ApplicationStatusCounts = emptyStatusCounts();
    for (const application of jobApplications) {
      counts.total += 1;
      if (application.status === "Pending") counts.pending += 1;
      if (application.status === "Accepted") counts.accepted += 1;
      if (application.status === "Rejected") counts.rejected += 1;
    }

    const query = search.trim().toLowerCase();
    const filtered = jobApplications
      .filter((application) => {
        if (status !== "All" && application.status !== status) return false;
        if (!query) return true;

        return [application.full_name, application.email]
          .join(" ")
          .toLowerCase()
          .includes(query);
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;

    return {
      job,
      applications: filtered.slice(start, start + pageSize),
      total,
      totalPages,
      page: currentPage,
      pageSize,
      counts,
      hasApplications: jobApplications.length > 0,
      hasFilters: status !== "All" || query !== "",
    };
  }, [applications, jobId, jobs, page, pageSize, search, status]);
}
