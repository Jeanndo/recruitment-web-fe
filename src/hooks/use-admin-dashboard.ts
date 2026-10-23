"use client";

import { useQuery } from "@tanstack/react-query";

import { getAdminDashboard } from "@/lib/admin-api";
import { adminKeys } from "@/lib/query-keys";

export function useAdminDashboard() {
  return useQuery({
    queryKey: adminKeys.dashboard,
    queryFn: getAdminDashboard,
  });
}
