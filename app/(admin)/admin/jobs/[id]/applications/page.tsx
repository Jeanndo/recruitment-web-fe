import type { Metadata } from "next";
import { Suspense } from "react";

import { JobApplications } from "@/components/admin/job-applications";

export const instant = false

export const metadata: Metadata = {
  title: "Applications",
};

export default function JobApplicationsPage() {
  return (
    <Suspense fallback={null}>
      <JobApplications />
    </Suspense>
  );
}
