import type { Metadata } from "next";

import { JobForm } from "@/components/admin/job-form";

export const metadata: Metadata = {
  title: "New role",
};

export default function NewJobPage() {
  return <JobForm />;
}
