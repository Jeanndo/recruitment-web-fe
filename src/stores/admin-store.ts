"use client";

import { create } from "zustand";

import { MOCK_ADMIN_APPLICATIONS, MOCK_ADMIN_JOBS } from "@/mocks/admin";
import {
  APPLICATION_STATUS_TRANSITIONS,
  type AdminApplicationDetail,
  type AdminJobListItem,
  type ApplicationStatus,
  type ReviewActionResult,
} from "@/types/admin";

interface AdminState {
  jobs: AdminJobListItem[];
  applications: AdminApplicationDetail[];
  updateApplicationStatus: (
    id: number,
    status: ApplicationStatus,
    adminNote?: string | null,
  ) => ReviewActionResult;
  saveAdminNote: (id: number, note: string | null) => ReviewActionResult;
}

/**
 * Preview data for the admin area.
 */
export const useAdminStore = create<AdminState>((set, get) => ({
  jobs: MOCK_ADMIN_JOBS,
  applications: MOCK_ADMIN_APPLICATIONS,

  updateApplicationStatus: (id, status, adminNote) => {
    const application = get().applications.find((item) => item.id === id);

    if (!application) {
      return { ok: false, message: "That application no longer exists." };
    }

    if (!APPLICATION_STATUS_TRANSITIONS[application.status].includes(status)) {
      return {
        ok: false,
        message: "That status change is not allowed.",
      };
    }

    set((state) => ({
      applications: state.applications.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              admin_note:
                adminNote === undefined ? item.admin_note : adminNote || null,
            }
          : item,
      ),
    }));

    const changed = application.status !== status;
    return {
      ok: true,
      message: changed
        ? `${application.full_name} was ${status.toLowerCase()}.`
        : "Internal note saved.",
    };
  },

  saveAdminNote: (id, note) => {
    const application = get().applications.find((item) => item.id === id);

    if (!application) {
      return { ok: false, message: "That application no longer exists." };
    }

    return get().updateApplicationStatus(id, application.status, note);
  },
}));
