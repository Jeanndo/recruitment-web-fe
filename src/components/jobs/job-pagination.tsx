"use client";

import { Pagination } from "@/components/ui/pagination";
import { scrollToId } from "@/lib/scroll";
import { useJobsStore } from "@/stores/jobs-store";

export function JobPagination({
  page,
  totalPages,
  total,
  pageSize,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
}) {
  const setPage = useJobsStore((state) => state.setPage);

  return (
    <Pagination
      page={page}
      totalPages={totalPages}
      total={total}
      pageSize={pageSize}
      itemsLabel="roles"
      ariaLabel="Job results pages"
      className="mt-10"
      onPageChange={(next) => {
        setPage(next);
        scrollToId("open-roles");
      }}
    />
  );
}
