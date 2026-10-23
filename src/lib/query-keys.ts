import type { AdminJobFilter, ApplicationFilter } from "@/types/admin";

export const adminKeys = {
  me: ["admin", "me"] as const,
  dashboard: ["admin", "dashboard"] as const,
  jobs: (filters: { status: AdminJobFilter; search: string; page: number; pageSize: number }) =>
    ["admin", "jobs", filters] as const,
  job: (id: number) => ["admin", "job", id] as const,
  applications: (
    jobId: number,
    filters: {
      status: ApplicationFilter;
      search: string;
      page: number;
      pageSize: number;
    },
  ) => ["admin", "applications", jobId, filters] as const,
  application: (id: number) => ["admin", "application", id] as const,
};
