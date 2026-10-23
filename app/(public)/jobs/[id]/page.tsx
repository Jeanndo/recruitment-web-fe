import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Check,
  MapPin,
} from "lucide-react";

import { ApplyForm } from "@/components/jobs/apply-form";
import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";
import { ApiError, getJob } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const instant = false;

type JobPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({
  params,
}: JobPageProps): Promise<Metadata> {
  const { id } = await params;
  const jobId = Number(id);

  if (Number.isNaN(jobId)) {
    return { title: "Role not found" };
  }

  try {
    const job = await getJob(jobId);
    return { title: job.title, description: job.summary };
  } catch {
    return { title: "Role not found" };
  }
}

export default async function JobDetailPage({ params }: JobPageProps) {
  const { id } = await params;
  const jobId = Number(id);

  if (Number.isNaN(jobId)) {
    notFound();
  }

  let job;
  try {
    job = await getJob(jobId);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    notFound();
  }

  return (
    <article className="pb-16">
      <Container className="pt-8 sm:pt-10">
        <Link
          href="/#open-roles"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          All open roles
        </Link>

        <header className="mt-6 max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge className="bg-accent text-primary">{job.employment_type}</Badge>
            {job.is_accepting_applications ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <span aria-hidden="true" className="size-2 rounded-full bg-primary" />
                Accepting applications
              </span>
            ) : null}
          </div>

          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-5xl">
            {job.title}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-2">
              <Briefcase aria-hidden="true" className="size-4" />
              {job.employment_type}
            </span>
            <span className="inline-flex items-center gap-2">
              <CalendarDays aria-hidden="true" className="size-4" />
              Closes {formatDate(job.closing_date)}
            </span>
          </div>
        </header>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-14">
          <div className="space-y-10">
            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                About the role
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                {job.description}
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                What you&apos;ll do
              </h2>
              <ul className="mt-3 space-y-3">
                {job.responsibilities.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold tracking-tight">
                What we&apos;re looking for
              </h2>
              <ul className="mt-3 space-y-3">
                {job.requirements.map((item) => (
                  <li key={item} className="flex gap-3 text-sm leading-relaxed">
                    <Check
                      aria-hidden="true"
                      className="mt-0.5 size-4 shrink-0 text-primary"
                    />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:h-fit">
            <div className="rounded-2xl border border-border bg-card p-6">
              <p className="text-sm font-semibold">Role details</p>

              <dl className="mt-4 space-y-4 text-sm">
                <div>
                  <dt className="text-muted-foreground">Employment type</dt>
                  <dd className="mt-0.5 font-medium">{job.employment_type}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="mt-0.5 font-medium">{job.location}</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Closing date</dt>
                  <dd className="mt-0.5 font-medium">
                    {formatDate(job.closing_date)}
                  </dd>
                </div>
              </dl>

              <a
                href="#apply"
                className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Apply for this role
              </a>
              <p className="mt-3 text-center text-xs text-muted-foreground">
                No account needed.
              </p>
            </div>
          </aside>
        </div>

        <section
          id="apply"
          className="mt-14 scroll-mt-24 border-t border-border pt-10"
        >
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Apply for this role
              </h2>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
                Send the essentials — a CV and a way to reach you. Every
                application is read by a person, and you will get a clear answer
                either way.
              </p>
            </div>

            <ApplyForm jobId={job.id} jobTitle={job.title} acceptingApplications={job.is_accepting_applications} />
          </div>
        </section>
      </Container>
    </article>
  );
}
