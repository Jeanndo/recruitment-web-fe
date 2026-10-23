import type { Metadata } from "next";

import { AdminShell } from "@/components/admin/admin-shell";

// The admin area is session-gated and renders its data in the browser, so
// navigations are allowed to block while the client fetches the next screen.
export const instant = false;

export const metadata: Metadata = {
  title: {
    default: "Admin",
    template: "%s · BrightCore Admin",
  },
  description: "Review roles and applications in the BrightCore workspace.",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
