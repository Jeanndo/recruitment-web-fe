"use client";

import { useMemo } from "react";

import { useAdminStore } from "@/stores/admin-store";
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
  const jobs = useAdminStore((state) => state.jobs);

  return useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = jobs.filter((job) => {
      if (status !== "All" && job.status !== status) return false;
      if (!query) return true;

      return [job.title, job.location].join(" ").toLowerCase().includes(query);
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;

    const counts: Record<AdminJobFilter, number> = {
      All: jobs.length,
      Open: jobs.filter((job) => job.status === "Open").length,
      Closed: jobs.filter((job) => job.status === "Closed").length,
      Draft: jobs.filter((job) => job.status === "Draft").length,
    };

    return {
      jobs: filtered.slice(start, start + pageSize),
      total,
      totalPages,
      page: currentPage,
      pageSize,
      counts,
      hasFilters: status !== "All" || query !== "",
    };
  }, [jobs, page, pageSize, search, status]);
}
