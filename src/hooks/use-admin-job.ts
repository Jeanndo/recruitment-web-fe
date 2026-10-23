"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminJob } from "@/lib/admin-api";
import { adminKeys } from "@/lib/query-keys";

export function useAdminJob(id: number) {
  return useQuery({
    queryKey: adminKeys.job(id),
    queryFn: () => getAdminJob(id),
    enabled: Number.isInteger(id) && id > 0,
    retry: false,
  });
}
