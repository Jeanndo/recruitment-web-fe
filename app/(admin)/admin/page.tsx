import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminOverview } from "@/components/admin/admin-overview";

export const instant = false;

export const metadata: Metadata = {
  title: "Overview",
};

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={null}>
      <AdminOverview />
    </Suspense>
  );
}
