"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, ShieldAlert } from "lucide-react";

import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { Brand } from "@/components/layout/brand";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCurrentUser } from "@/hooks/use-admin-auth";
import { UNAUTHORIZED_EVENT } from "@/lib/admin-api";
import type { AdminUser } from "@/types/admin";

function AdminSidebarFallback() {
  return <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground" />;
}

function AdminTopbarFallback() {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-border bg-background/95 px-4 sm:px-6 lg:px-8" />
  );
}

function AdminLoading({ label = "Checking your session…" }: { label?: string }) {
  return (
    <div className="grid min-h-svh place-items-center bg-muted/30 px-6">
      <div className="flex flex-col items-center text-center">
        <Brand href="/admin" />
        <Loader2
          aria-hidden="true"
          className="mt-6 size-5 animate-spin text-primary"
        />
        <p className="mt-3 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function AdminShellInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const currentUser = useCurrentUser();
  const [mobileOpen, setMobileOpen] = useState(false);

  const unauthorized =
    currentUser.isError &&
    typeof currentUser.error === "object" &&
    currentUser.error !== null &&
    "status" in currentUser.error &&
    currentUser.error.status === 401;

  const signInHref = `/admin/sign-in?next=${encodeURIComponent(
    `${pathname}${typeof window === "undefined" ? "" : window.location.search}`,
  )}`;

  useEffect(() => {
    if (unauthorized) {
      router.replace(signInHref);
    }
  }, [router, signInHref, unauthorized]);

  useEffect(() => {
    function handleUnauthorized() {
      router.replace(signInHref);
    }

    window.addEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
    return () =>
      window.removeEventListener(UNAUTHORIZED_EVENT, handleUnauthorized);
  }, [router, signInHref]);

  const user = currentUser.data as AdminUser | undefined;

  return (
    <div className="min-h-svh bg-muted/30">
      {(currentUser.isLoading || unauthorized) ? (
        <AdminLoading />
      ) : currentUser.isError || !user ? (
        <div className="grid min-h-svh place-items-center bg-muted/30 px-6">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <span className="mx-auto grid size-11 place-items-center rounded-xl bg-destructive/10 text-destructive">
              <ShieldAlert aria-hidden="true" className="size-5" />
            </span>
            <h1 className="mt-4 text-lg font-semibold tracking-tight">
              Could not open the admin area
            </h1>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {currentUser.error instanceof Error
                ? currentUser.error.message
                : "The BrightCore API could not be reached."}
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <button
                type="button"
                onClick={() => void currentUser.refetch()}
                className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Try again
              </button>
              <Link
                href="/admin/sign-in"
                className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-sm font-medium transition-colors hover:bg-muted"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <>
          <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-sidebar-border lg:block">
            <Suspense fallback={<AdminSidebarFallback />}>
              <AdminSidebar user={user} />
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
                <AdminSidebar
                  user={user}
                  onNavigate={() => setMobileOpen(false)}
                />
              </Suspense>
            </SheetContent>
          </Sheet>

          <div className="lg:pl-64">
            <Suspense fallback={<AdminTopbarFallback />}>
              <AdminTopbar
                user={user}
                onMenuOpen={() => setMobileOpen(true)}
              />
            </Suspense>
            <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
              <Suspense fallback={null}>{children}</Suspense>
            </main>
          </div>
        </>
      )}
    </div>
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AdminLoading />}>
      <AdminShellInner>{children}</AdminShellInner>
    </Suspense>
  );
}
