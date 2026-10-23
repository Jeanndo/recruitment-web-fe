"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  getCurrentUser,
  login,
  logout,
} from "@/lib/admin-api";
import { adminKeys } from "@/lib/query-keys";

export function useCurrentUser() {
  return useQuery({
    queryKey: adminKeys.me,
    queryFn: getCurrentUser,
    retry: false,
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: (data) => {
      queryClient.setQueryData(adminKeys.me, data.user);
      toast.success(`Welcome back, ${data.user.full_name.split(" ")[0]}.`);
    },
    onError: (error) => {
      toast.error(
        error instanceof Error ? error.message : "Sign in failed. Please try again.",
      );
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      toast.success("You have been signed out.");
    },
    onSettled: () => {
      queryClient.clear();
    },
  });
}
