"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import {
  closeAdminJob,
  createAdminJob,
  updateAdminJob,
} from "@/lib/admin-api";
import { adminKeys } from "@/lib/query-keys";
import type { JobCreateInput, JobUpdateInput } from "@/types/admin";

function useInvalidateJobs() {
  const queryClient = useQueryClient();

  return () => {
    void queryClient.invalidateQueries({ queryKey: ["admin", "jobs"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "job"] });
    void queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
  };
}

export function useCreateJob() {
  const invalidate = useInvalidateJobs();

  return useMutation({
    mutationFn: (payload: JobCreateInput) => createAdminJob(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateJob(id: number) {
  const invalidate = useInvalidateJobs();

  return useMutation({
    mutationFn: (payload: JobUpdateInput) => updateAdminJob(id, payload),
    onSuccess: invalidate,
  });
}

export function useCloseJob() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateJobs();

  return useMutation({
    mutationFn: (id: number) => closeAdminJob(id),
    onSuccess: (data) => {
      void queryClient.invalidateQueries({
        queryKey: adminKeys.job(data.id),
      });
      invalidate();
    },
  });
}
