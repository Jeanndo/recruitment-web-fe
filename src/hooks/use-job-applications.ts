"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { useAdminDashboard } from "@/hooks/use-admin-dashboard";
import { getJobApplications } from "@/lib/admin-api";
import { adminKeys } from "@/lib/query-keys";
import {
  emptyStatusCounts,
  type ApplicationFilter,
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
  const dashboard = useAdminDashboard();
  const query = useQuery({
    queryKey: adminKeys.applications(jobId, {
      status,
      search,
      page,
      pageSize,
    }),
    queryFn: () => getJobApplications({ jobId, status, search, page, pageSize }),
    enabled: Number.isInteger(jobId) && jobId > 0,
    placeholderData: keepPreviousData,
  });

  const dashboardJob = dashboard.data?.jobs.find(
    (job) => job.job_id === jobId,
  );
  const total = query.data?.total ?? 0;
  const counts = dashboardJob?.application_counts ?? emptyStatusCounts();

  return {
    job: dashboardJob,
    applications: query.data?.items ?? [],
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    page: query.data?.page ?? page,
    pageSize: query.data?.page_size ?? pageSize,
    counts,
    hasApplications: counts.total > 0,
    isLoading: query.isLoading || dashboard.isLoading,
    isFetching: query.isFetching || dashboard.isFetching,
    isError: query.isError || dashboard.isError,
    error: query.error ?? dashboard.error,
    refetch: query.refetch,
  };
}
