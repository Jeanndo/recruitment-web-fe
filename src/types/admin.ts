import type {
  EmploymentType,
  JobStatus,
  PaginatedResponse,
} from "@/types/api";

/** Where an application is in the review process. Matches the API values. */
export type ApplicationStatus = "Pending" | "Accepted" | "Rejected";

/** Staff roles allowed into the admin area. Matches the API values. */
export type UserRole = "admin" | "recruiter";

/** A signed-in staff member, as returned by `/api/v1/auth/me`. */
export interface AdminUser {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
}

/** Response of `POST /api/v1/auth/login`. */
export interface LoginResponse {
  user: AdminUser;
  message: string;
}

/** Application status totals. */
export interface ApplicationStatusCounts {
  pending: number;
  accepted: number;
  rejected: number;
  total: number;
}

/** One job row in the admin overview. */
export interface JobDashboardSummary {
  job_id: number;
  title: string;
  location: string;
  closing_date: string;
  status: JobStatus;
  application_counts: ApplicationStatusCounts;
}

/** Response of `GET /api/v1/admin/dashboard`. */
export interface DashboardResponse {
  total_jobs: number;
  open_jobs: number;
  closed_jobs: number;
  draft_jobs: number;
  total_applications: number;
  application_counts: ApplicationStatusCounts;
  jobs: JobDashboardSummary[];
}

/** One row in the admin jobs table. */
export interface AdminJobListItem {
  id: number;
  title: string;
  location: string;
  status: JobStatus;
  closing_date: string;
  application_count: number;
}

/** Full job shape returned by the admin create, update and get endpoints. */
export interface AdminJobDetail {
  id: number;
  title: string;
  location: string;
  employment_type: EmploymentType;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  closing_date: string;
  status: JobStatus;
  is_accepting_applications: boolean;
  created_at: string;
  updated_at: string;
}

/** Payload of `POST /api/v1/admin/jobs`. */
export interface JobCreateInput {
  title: string;
  location: string;
  employment_type: EmploymentType;
  summary: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  closing_date: string;
  status: Extract<JobStatus, "Draft" | "Open">;
}

/** Payload of `PATCH /api/v1/admin/jobs/{id}`. */
export type JobUpdateInput = Partial<Omit<JobCreateInput, "status">> & {
  status?: JobStatus;
};

/** Result of closing a job. */
export interface JobCloseResponse {
  id: number;
  status: JobStatus;
  message: string;
}

/** Job information shown inside an application review. */
export interface AdminJobReference {
  id: number;
  title: string;
  location: string;
  closing_date: string;
  status: JobStatus;
}

/** Metadata for a stored CV. */
export interface CVMetadata {
  application_id: number;
  filename: string;
  content_type: string;
  size_bytes: number;
  download_url: string;
}

/** One row in the applications table. */
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

/** Full application returned by the detail endpoint. */
export interface AdminApplicationDetail extends AdminApplicationItem {
  cover_note: string;
  admin_note: string | null;
  job: AdminJobReference;
  cv: CVMetadata | null;
}

/** Response of the review status endpoint. */
export interface ApplicationStatusResponse {
  id: number;
  status: ApplicationStatus;
  admin_note: string | null;
  updated_at: string;
}

/** Status filter used by the admin tables. `All` is UI-only. */
export type AdminJobFilter = JobStatus | "All";
export type ApplicationFilter = ApplicationStatus | "All";

export type JobsPage = PaginatedResponse<AdminJobListItem>;
export type ApplicationsPage = PaginatedResponse<AdminApplicationItem>;

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

/** The lifecycle moves the backend accepts for a job status. */
export const JOB_STATUS_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  Draft: ["Draft", "Open", "Closed"],
  Open: ["Open", "Closed"],
  Closed: ["Closed", "Open"],
};

export function emptyStatusCounts(): ApplicationStatusCounts {
  return { pending: 0, accepted: 0, rejected: 0, total: 0 };
}

export function displayRole(role: UserRole): string {
  return role === "admin" ? "Administrator" : "Recruiter";
}
