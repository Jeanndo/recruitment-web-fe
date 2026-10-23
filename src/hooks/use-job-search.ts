"use client";

import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";

import { MOCK_JOBS } from "@/mocks/jobs";
import { useJobsStore } from "@/stores/jobs-store";

/**
 * The single place the UI reads job results from.
 */
export function useJobSearch() {
  const { search, employmentType, page, pageSize } = useJobsStore(
    useShallow((state) => ({
      search: state.search,
      employmentType: state.employmentType,
      page: state.page,
      pageSize: state.pageSize,
    })),
  );

  const results = useMemo(() => {
    const query = search.trim().toLowerCase();

    const filtered = MOCK_JOBS.filter((job) => {
      const matchesType =
        employmentType === "All" || job.employment_type === employmentType;

      if (!matchesType) return false;
      if (!query) return true;

      const haystack = [
        job.title,
        job.location,
        job.summary,
        job.employment_type,
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(query);
    });

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const currentPage = Math.min(Math.max(page, 1), totalPages);
    const start = (currentPage - 1) * pageSize;

    return {
      jobs: filtered.slice(start, start + pageSize),
      total,
      totalPages,
      page: currentPage,
    };
  }, [search, employmentType, page, pageSize]);

  return {
    ...results,
    pageSize,
    search,
    employmentType,
    hasFilters: search.trim() !== "" || employmentType !== "All",
  };
}
