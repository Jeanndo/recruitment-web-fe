"use client";

import { useEffect, useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useShallow } from "zustand/react/shallow";

import { getJobs } from "@/lib/api";
import { useJobsStore } from "@/stores/jobs-store";

/**
 * The single place the UI reads job results from.
 *
 * The search box updates on every keystroke, so the text sent to the API is
 * debounced while the chips and pagination take effect immediately.
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
  const setPage = useJobsStore((state) => state.setPage);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timeout = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(timeout);
  }, [search]);

  const trimmedSearch = debouncedSearch.trim();

  const query = useQuery({
    queryKey: [
      "public-jobs",
      {
        search: trimmedSearch,
        employmentType,
        page,
        pageSize,
      },
    ],
    queryFn: () =>
      getJobs({
        search: trimmedSearch || undefined,
        employment_type: employmentType === "All" ? undefined : employmentType,
        page,
        page_size: pageSize,
      }),
    placeholderData: keepPreviousData,
  });

  const data = query.data;
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  // A filter can shrink the result set below the page the visitor is on.
  useEffect(() => {
    if (data && page > totalPages) {
      setPage(totalPages);
    }
  }, [data, page, totalPages, setPage]);

  return {
    jobs: data?.items ?? [],
    total,
    totalPages,
    page: Math.min(data?.page ?? page, totalPages),
    pageSize,
    search,
    employmentType,
    hasFilters: search.trim() !== "" || employmentType !== "All",
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}
