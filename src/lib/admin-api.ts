import { ApiError, apiBaseUrl } from "@/lib/api";
import type {
  AdminApplicationDetail,
  AdminApplicationItem,
  AdminJobDetail,
  AdminJobFilter,
  AdminUser,
  ApplicationFilter,
  ApplicationStatus,
  ApplicationStatusResponse,
  ApplicationsPage,
  DashboardResponse,
  JobCloseResponse,
  JobCreateInput,
  JobsPage,
  JobUpdateInput,
  LoginResponse,
} from "@/types/admin";

export const UNAUTHORIZED_EVENT = "brightcore:unauthorized";

type ValidationDetail = { loc: (string | number)[]; msg: string; type: string };

function errorMessage(detail: unknown, fallback: string): string {
  if (typeof detail === "string" && detail.trim()) return detail;

  if (Array.isArray(detail)) {
    const messages = (detail as ValidationDetail[])
      .map((item) => {
        if (!item || typeof item !== "object") return null;
        const field = Array.isArray(item.loc) ? item.loc.at(-1) : undefined;
        return field ? `${String(field)}: ${item.msg}` : item.msg;
      })
      .filter(Boolean);

    if (messages.length > 0) return messages.join(" ");
  }

  return fallback;
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  skipAuthRedirect?: boolean;
}

async function request<T>(
  path: string,
  { body, skipAuthRedirect = false, headers, ...init }: RequestOptions = {},
): Promise<T> {
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");

  if (body !== undefined) {
    requestHeaders.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl()}${path}`, {
      ...init,
      headers: requestHeaders,
      credentials: "include",
      cache: "no-store",
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Could not reach the BrightCore API.");
  }

  if (response.status === 401 && !skipAuthRedirect) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!response.ok) {
    let payload: unknown = null;
    try {
      payload = await response.json();
    } catch {
      // The API normally returns JSON, but a proxy error may not.
    }

    const detail =
      payload && typeof payload === "object" && "detail" in payload
        ? (payload as { detail: unknown }).detail
        : null;

    throw new ApiError(
      errorMessage(detail, defaultMessage(response.status)),
      response.status,
    );
  }

  if (response.status === 204) return undefined as T;

  return (await response.json()) as T;
}

function defaultMessage(status: number): string {
  if (status === 401) return "Your session has expired. Please sign in again.";
  if (status === 403) return "You do not have permission to do that.";
  if (status === 404) return "That item could not be found.";
  if (status === 409) return "That change is not allowed right now.";
  if (status === 422) return "Please check the highlighted fields and try again.";
  return "Something went wrong. Please try again.";
}

function queryString(
  values: Record<string, string | number | undefined | null>,
): string {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") {
      params.set(key, String(value));
    }
  }

  const query = params.toString();
  return query ? `?${query}` : "";
}

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

export function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/api/v1/auth/login", {
    method: "POST",
    body: { email, password },
    skipAuthRedirect: true,
  });
}

export function logout(): Promise<{ message: string }> {
  return request<{ message: string }>("/api/v1/auth/logout", {
    method: "POST",
    skipAuthRedirect: true,
  });
}

export function getCurrentUser(): Promise<AdminUser> {
  return request<AdminUser>("/api/v1/auth/me", {
    skipAuthRedirect: true,
  });
}

// ---------------------------------------------------------------------------
// Dashboard
// ---------------------------------------------------------------------------

export function getAdminDashboard(): Promise<DashboardResponse> {
  return request<DashboardResponse>("/api/v1/admin/dashboard");
}

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export function getAdminJobs({
  status,
  search,
  page,
  pageSize,
}: {
  status: AdminJobFilter;
  search: string;
  page: number;
  pageSize: number;
}): Promise<JobsPage> {
  return request<JobsPage>(
    `/api/v1/admin/jobs${queryString({
      status: status === "All" ? undefined : status,
      search: search.trim() || undefined,
      page,
      page_size: pageSize,
    })}`,
  );
}

export function getAdminJob(id: number): Promise<AdminJobDetail> {
  return request<AdminJobDetail>(`/api/v1/admin/jobs/${id}`);
}

export function createAdminJob(payload: JobCreateInput): Promise<AdminJobDetail> {
  return request<AdminJobDetail>("/api/v1/admin/jobs", {
    method: "POST",
    body: payload,
  });
}

export function updateAdminJob(
  id: number,
  payload: JobUpdateInput,
): Promise<AdminJobDetail> {
  return request<AdminJobDetail>(`/api/v1/admin/jobs/${id}`, {
    method: "PATCH",
    body: payload,
  });
}

export function closeAdminJob(id: number): Promise<JobCloseResponse> {
  return request<JobCloseResponse>(`/api/v1/admin/jobs/${id}/close`, {
    method: "PATCH",
  });
}

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export function getJobApplications({
  jobId,
  status,
  search,
  page,
  pageSize,
}: {
  jobId: number;
  status: ApplicationFilter;
  search: string;
  page: number;
  pageSize: number;
}): Promise<ApplicationsPage> {
  return request<ApplicationsPage>(
    `/api/v1/admin/jobs/${jobId}/applications${queryString({
      status: status === "All" ? undefined : status,
      search: search.trim() || undefined,
      page,
      page_size: pageSize,
    })}`,
  );
}

export function getApplication(id: number): Promise<AdminApplicationDetail> {
  return request<AdminApplicationDetail>(`/api/v1/admin/applications/${id}`);
}

export function updateApplicationStatus(
  id: number,
  status: ApplicationStatus,
  adminNote?: string | null,
): Promise<ApplicationStatusResponse> {
  return request<ApplicationStatusResponse>(
    `/api/v1/admin/applications/${id}/status`,
    {
      method: "PATCH",
      body:
        adminNote === undefined
          ? { status }
          : { status, admin_note: adminNote },
    },
  );
}

function filenameFromDisposition(value: string | null): string | null {
  if (!value) return null;

  const encoded = value.match(/filename\*=UTF-8''([^;]+)/i)?.[1];
  if (encoded) {
    try {
      return decodeURIComponent(encoded);
    } catch {
      return encoded;
    }
  }

  return value.match(/filename="?([^";]+)"?/i)?.[1] ?? null;
}

/** Download a CV through the authenticated endpoint and save the blob. */
export async function downloadApplicationCv(
  application: Pick<AdminApplicationItem, "id" | "full_name">,
): Promise<string> {
  let response: Response;

  try {
    response = await fetch(
      `${apiBaseUrl()}/api/v1/admin/applications/${application.id}/cv`,
      {
        credentials: "include",
        cache: "no-store",
      },
    );
  } catch {
    throw new ApiError("Could not reach the BrightCore API.");
  }

  if (response.status === 401) {
    window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
  }

  if (!response.ok) {
    throw new ApiError(
      defaultMessage(response.status),
      response.status,
    );
  }

  const blob = await response.blob();
  const filename =
    filenameFromDisposition(response.headers.get("Content-Disposition")) ??
    `${application.full_name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-cv.pdf`;
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);

  return filename;
}
