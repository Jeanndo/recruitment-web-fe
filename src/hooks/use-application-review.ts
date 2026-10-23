"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  downloadApplicationCv,
  getApplication,
  updateApplicationStatus,
} from "@/lib/admin-api";
import { adminKeys } from "@/lib/query-keys";
import type {
  AdminApplicationItem,
  ApplicationStatus,
} from "@/types/admin";

export function useApplicationDetail(id: number | null) {
  return useQuery({
    queryKey: id ? adminKeys.application(id) : ["admin", "application", "none"],
    queryFn: () => getApplication(id as number),
    enabled: id !== null && Number.isInteger(id) && id > 0,
    retry: false,
  });
}

export function useUpdateApplicationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
      adminNote,
    }: {
      id: number;
      status: ApplicationStatus;
      adminNote?: string | null;
    }) => updateApplicationStatus(id, status, adminNote),
    onSuccess: (data) => {
      queryClient.setQueryData(adminKeys.application(data.id), (current) => {
        if (!current || typeof current !== "object") return current;
        return { ...current, status: data.status, admin_note: data.admin_note };
      });
      void queryClient.invalidateQueries({
        queryKey: ["admin", "applications"],
      });
      void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
    },
  });
}

export function useDownloadCv() {
  return useMutation({
    mutationFn: (application: Pick<AdminApplicationItem, "id" | "full_name">) =>
      downloadApplicationCv(application),
  });
}
