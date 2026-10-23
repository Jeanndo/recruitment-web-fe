import type {
  EmploymentType,
  JobDetail,
  JobListItem,
  PaginatedResponse,
} from "@/types/api";

const FALLBACK_API_URL = "http://localhost:8000";


export function apiBaseUrl(): string {
  const value =
    typeof window === "undefined"
      ? (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL)
      : process.env.NEXT_PUBLIC_API_URL;

  return (value ?? FALLBACK_API_URL).replace(/\/+$/, "");
}

/** An error caused by the API being unreachable or returning a bad status. */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export interface JobListQuery {
  search?: string;
  location?: string;
  employment_type?: EmploymentType;
  page?: number;
  page_size?: number;
}

/** Fetch a page of open jobs. Pass `cache: "no-store"` for fresh results. */
export async function getJobs(
  query: JobListQuery = {},
  init?: RequestInit,
): Promise<PaginatedResponse<JobListItem>> {
  const url = new URL("/api/v1/jobs", apiBaseUrl());

  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch {
    throw new ApiError("Could not reach the BrightCore API.");
  }

  if (!response.ok) {
    throw new ApiError(
      "The job board is unavailable right now.",
      response.status,
    );
  }

  return (await response.json()) as PaginatedResponse<JobListItem>;
}

export async function getJob(
  jobId: number,
  init?: RequestInit,
): Promise<JobDetail> {
  const url = new URL(`/api/v1/jobs/${jobId}`, apiBaseUrl());

  const headers = new Headers(init?.headers);
  headers.set("Accept", "application/json");

  let response: Response;
  try {
    response = await fetch(url, { ...init, headers });
  } catch {
    throw new ApiError("Could not reach the BrightCore API.");
  }

  if (!response.ok) {
    throw new ApiError("This role could not be found.", response.status);
  }

  return (await response.json()) as JobDetail;
}

export interface ApplicationSubmitPayload {
  jobId: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  coverNote: string;
  cv: File;
}

export interface ApplicationCreated {
  id: number;
  job_id: number;
  status: string;
  message: string;
}

export async function submitApplication({
  jobId,
  fullName,
  email,
  phoneNumber,
  coverNote,
  cv,
}: ApplicationSubmitPayload): Promise<ApplicationCreated> {
  const url = new URL(`/api/v1/jobs/${jobId}/applications`, apiBaseUrl());
  const formData = new FormData();

  formData.append("full_name", fullName);
  formData.append("email", email);
  formData.append("phone_number", phoneNumber);
  formData.append("cover_note", coverNote.trim());
  formData.append("cv", cv);

  let response: Response;
  try {
    response = await fetch(url, {
      method: "POST",
      body: formData,
    });
  } catch {
    throw new ApiError("Could not reach the BrightCore API.");
  }

  if (!response.ok) {
    let message = "We couldn't submit your application right now.";
    try {
      const payload = await response.json();
      if (payload && typeof payload === "object" && "detail" in payload) {
        const detail = (payload as { detail: unknown }).detail;
        if (typeof detail === "string") message = detail;
        else if (Array.isArray(detail) && detail.length > 0) {
          const first = detail[0];
          if (first && typeof first === "object" && "msg" in first) {
            message = String((first as { msg: unknown }).msg);
          }
        }
      }
    } catch {
      // ignore
    }
    throw new ApiError(message, response.status);
  }

  return (await response.json()) as ApplicationCreated;
}
