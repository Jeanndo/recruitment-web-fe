import { cacheLife } from "next/cache";
import Link from "next/link";
import { ArrowUpRight, Mail, MapPin } from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { Container } from "@/components/layout/container";

async function CopyrightYear() {
  "use cache";
  cacheLife("days");

  return <>{new Date().getFullYear()}</>;
}

const jobSeekerLinks = [
  { href: "/#open-roles", label: "Open roles" },
  { href: "/#newsletter", label: "Get job alerts" },
  { href: "/#top", label: "Back to top" },
];

export function SiteFooter() {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <Brand className="text-white" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-neutral-400">
            A simple job board for people who care about their craft. Fewer
            roles, more attention, and a person at the end of every application.
          </p>
        </div>

        <nav aria-label="Job seekers" className="lg:col-span-3">
          <p className="text-xs font-semibold tracking-[0.12em] text-neutral-500 uppercase">
            Job seekers
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            {jobSeekerLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-4">
          <p className="text-xs font-semibold tracking-[0.12em] text-neutral-500 uppercase">
            Contact
          </p>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a
                href="mailto:hello@brightcore.co"
                className="inline-flex items-center gap-2 transition-colors hover:text-white"
              >
                <Mail aria-hidden="true" className="size-4 text-neutral-500" />
                hello@brightcore.co
              </a>
            </li>
            <li className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 text-neutral-500" />
              Kigali, Rwanda · Remote-friendly
            </li>
            <li>
              <Link
                href="/#newsletter"
                className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-white"
              >
                Subscribe to the newsletter
                <ArrowUpRight aria-hidden="true" className="size-3.5" />
              </Link>
            </li>
          </ul>
        </div>
      </Container>

      <Container className="flex flex-col gap-2 border-t border-white/10 py-5 text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between">
        <p>
          © <CopyrightYear /> BrightCore. All rights reserved.
        </p>
        <p>Built for job seekers, not for algorithms.</p>
      </Container>
    </footer>
  );
}
