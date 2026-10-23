"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Briefcase, LayoutDashboard, LogOut } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { cn } from "@/lib/utils";
import { initials } from "@/lib/format";

const navigation = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
    isActive: (pathname: string) => pathname === "/admin",
  },
  {
    href: "/admin/jobs",
    label: "Jobs",
    icon: Briefcase,
    isActive: (pathname: string) => pathname.startsWith("/admin/jobs"),
  },
];

export function AdminSidebar({
  onNavigate,
}: {
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border pr-12 pl-5">
        <Brand href="/admin" />
        
      </div>

      <nav aria-label="Admin" className="flex-1 space-y-1 p-4">
       
        {navigation.map((item) => {
          const active = item.isActive(pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
              )}
            >
              <Icon aria-hidden="true" className="size-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-xl bg-sidebar-accent/60 p-3">
          <span
            aria-hidden="true"
            className="grid size-9 shrink-0 place-items-center rounded-full bg-primary text-xs font-semibold text-primary-foreground"
          >
            {initials("Aline Mukamana")}
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">Aline Mukamana</p>
            <p className="truncate text-xs text-muted-foreground">
              Administrator
            </p>
          </div>
        </div>

        <Link
          href="/sign-in"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent/60 hover:text-sidebar-foreground"
        >
          <LogOut aria-hidden="true" className="size-4" />
          Sign out
        </Link>
      </div>
    </div>
  );
}
