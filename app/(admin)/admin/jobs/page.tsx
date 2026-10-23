import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminJobs } from "@/components/admin/admin-jobs";

export const metadata: Metadata = {
  title: "Jobs",
};

export default function AdminJobsPage() {
  return (
    <Suspense fallback={null}>
      <AdminJobs />
    </Suspense>
  );
}
