"use client";

import { Suspense, useState } from "react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";

function AdminSidebarFallback() {
  return <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground" />;
}

function AdminTopbarFallback() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 sm:px-6 lg:px-8" />
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-svh bg-muted/30">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
        <Suspense fallback={<AdminSidebarFallback />}>
          <AdminSidebar />
        </Suspense>
      </aside>

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[17rem] gap-0 bg-sidebar p-0 sm:max-w-[17rem]"
        >
          <SheetTitle className="sr-only">Admin navigation</SheetTitle>
          <SheetDescription className="sr-only">
            Links to the BrightCore admin workspace.
          </SheetDescription>
          <Suspense fallback={<AdminSidebarFallback />}>
            <AdminSidebar onNavigate={() => setMobileOpen(false)} />
          </Suspense>
        </SheetContent>
      </Sheet>

      <div className="lg:pl-64">
        <Suspense fallback={<AdminTopbarFallback />}>
          <AdminTopbar onMenuOpen={() => setMobileOpen(true)} />
        </Suspense>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Suspense fallback={null}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
