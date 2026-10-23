import type { EmploymentType, JobListItem, PaginatedResponse } from "@/types/api";

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
