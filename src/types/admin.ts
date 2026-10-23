import type { JobStatus } from "@/types/api";

/** Where an application is in the review process. Matches the API values. */
export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

/** Application Status Counts*/
export interface ApplicationStatusCounts {
  pending: number;
  accepted: number;
  rejected: number;
  total: number;
}

/** Job Dashboard Summary */
export interface JobDashboardSummary {
  job_id: number;
  title: string;
  status: JobStatus;
  application_counts: ApplicationStatusCounts;
}

/**Dashboard Job Response stats*/
export interface DashboardResponse {
  total_jobs: number;
  open_jobs: number;
  closed_jobs: number;
  draft_jobs: number;
  total_applications: number;
  application_counts: ApplicationStatusCounts;
  jobs: JobDashboardSummary[];
}

/** Admin Job ListItem */
export interface AdminJobListItem {
  id: number;
  title: string;
  location: string;
  status: JobStatus;
  closing_date: string;
  application_count: number;
}

/** Admin Job Reference  */
export interface AdminJobReference {
  id: number;
  title: string;
  location: string;
  closing_date: string;
  status: JobStatus;
}

/** CV Metadata Response  */
export interface CVMetadata {
  application_id: number;
  filename: string;
  content_type: string;
  size_bytes: number;
  download_url: string;
}

/** Admin Application Item*/
export interface AdminApplicationItem {
  id: number;
  job_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  status: ApplicationStatus;
  created_at: string;
  cv_available: boolean;
}

/** AdminApplicationDetail*/
export interface AdminApplicationDetail extends AdminApplicationItem {
  cover_note: string;
  admin_note: string | null;
  job: AdminJobReference;
  cv: CVMetadata | null;
}

/** Status filter used by the admin tables. `All` is UI-only. */
export type AdminJobFilter = JobStatus | "All";
export type ApplicationFilter = ApplicationStatus | "All";

/** The shape returned by the mock review actions. */
export interface ReviewActionResult {
  ok: boolean;
  message: string;
}

export const APPLICATION_STATUSES: ApplicationStatus[] = [
  "Pending",
  "Accepted",
  "Rejected",
];

/** The lifecycle moves the backend accepts for a review status. */
export const APPLICATION_STATUS_TRANSITIONS: Record<
  ApplicationStatus,
  ApplicationStatus[]
> = {
  Pending: ["Accepted", "Rejected"],
  Accepted: ["Accepted", "Rejected"],
  Rejected: ["Rejected", "Accepted"],
};

export function emptyStatusCounts(): ApplicationStatusCounts {
  return { pending: 0, accepted: 0, rejected: 0, total: 0 };
}
