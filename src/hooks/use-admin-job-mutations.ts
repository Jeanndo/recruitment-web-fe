"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

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

function errorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export function useCreateJob() {
  const invalidate = useInvalidateJobs();

  return useMutation({
    mutationFn: (payload: JobCreateInput) => createAdminJob(payload),
    onSuccess: () => {
      toast.success("Role created.");
      invalidate();
    },
    onError: (error) => {
      toast.error(errorMessage(error, "The role could not be created."));
    },
  });
}

export function useUpdateJob(id: number) {
  const invalidate = useInvalidateJobs();

  return useMutation({
    mutationFn: (payload: JobUpdateInput) => updateAdminJob(id, payload),
    onSuccess: () => {
      toast.success("Role changes saved.");
      invalidate();
    },
    onError: (error) => {
      toast.error(errorMessage(error, "The role could not be saved."));
    },
  });
}

export function useCloseJob() {
  const queryClient = useQueryClient();
  const invalidate = useInvalidateJobs();

  return useMutation({
    mutationFn: (id: number) => closeAdminJob(id),
    onSuccess: (data) => {
      toast.success(data.message);
      void queryClient.invalidateQueries({
        queryKey: adminKeys.job(data.id),
      });
      invalidate();
    },
    onError: (error) => {
      toast.error(errorMessage(error, "The role could not be closed."));
    },
  });
}
