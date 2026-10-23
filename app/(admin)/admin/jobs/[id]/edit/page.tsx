import type { Metadata } from "next";

import { EditJobPageContent } from "@/components/admin/edit-job-page";

export const metadata: Metadata = {
  title: "Edit role",
};

export default function EditJobPage() {
  return <EditJobPageContent />;
}
