import Link from "next/link";

import { cn } from "@/lib/utils";

export function Brand({
  className,
  href = "/",
}: {
  className?: string;
  href?: string;
}) {
  return (
    <Link
      href={href}
      aria-label="BrightCore — home"
      className={cn(
        "inline-flex items-center gap-2.5 text-lg font-semibold tracking-tight transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="grid size-7 place-items-center rounded-lg bg-primary text-sm font-bold text-primary-foreground"
      >
        B
      </span>
      BrightCore
    </Link>
  );
}
