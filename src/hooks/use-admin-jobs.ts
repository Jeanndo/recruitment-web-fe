"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";

import { getAdminJobs } from "@/lib/admin-api";
import { adminKeys } from "@/lib/query-keys";
import type { AdminJobFilter } from "@/types/admin";

export interface AdminJobsQuery {
  status: AdminJobFilter;
  search: string;
  page: number;
  pageSize?: number;
}

export function useAdminJobs({
  status,
  search,
  page,
  pageSize = 8,
}: AdminJobsQuery) {
  const query = useQuery({
    queryKey: adminKeys.jobs({ status, search, page, pageSize }),
    queryFn: () => getAdminJobs({ status, search, page, pageSize }),
    placeholderData: keepPreviousData,
  });

  const items = query.data?.items ?? [];
  const total = query.data?.total ?? 0;

  return {
    jobs: items,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    page: query.data?.page ?? page,
    pageSize: query.data?.page_size ?? pageSize,
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
