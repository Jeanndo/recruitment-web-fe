/** Values the API uses for the shape of a contract. */
export type EmploymentType =
  | "Full-time"
  | "Part-time"
  | "Contract"
  | "Internship";

/** Lifecycle of a job posting. The public list only  returns Open roles. */
export type JobStatus = "Draft" | "Open" | "Closed";

/**
 * The reduced job shape returned by `GET /api/v1/jobs`.
 * Descriptions and bullet points only come back on the detail endpoint.
 */
export interface JobListItem {
  id: number;
  title: string;
  location: string;
  employment_type: EmploymentType;
  summary: string;
  closing_date: string;
  status: JobStatus;
  is_accepting_applications: boolean;
}

/** Matches the backend's `PaginatedResponse[T]` schema. */
export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  page_size: number;
  total: number;
}

/** Full job details as returned by the public job endpoint. */
export interface JobDetail extends JobListItem {
  description: string;
  responsibilities: string[];
  requirements: string[];
  created_at?: string;
  updated_at?: string;
}
