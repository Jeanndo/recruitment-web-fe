"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Loader2,
  Lock,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import {
  useFieldArray,
  useForm,
  type FieldErrors,
  type UseFormReturn,
} from "react-hook-form";
import { z } from "zod";

import { JobStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import {
  useCloseJob,
  useCreateJob,
  useUpdateJob,
} from "@/hooks/use-admin-job-mutations";
import type { EmploymentType, JobStatus } from "@/types/api";
import {
  JOB_STATUS_TRANSITIONS,
  type AdminJobDetail,
  type JobCreateInput,
} from "@/types/admin";

const employmentTypes: EmploymentType[] = [
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
];

const inputClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

const textareaClass =
  "w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20";

const bulletSchema = z.object({
  value: z
    .string()
    .trim()
    .min(3, "Use at least 3 characters.")
    .max(500, "Keep each point under 500 characters."),
});

const jobFormSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(3, "The title needs at least 3 characters.")
      .max(150, "Keep the title under 150 characters."),
    location: z
      .string()
      .trim()
      .min(2, "Add a location.")
      .max(150, "Keep the location under 150 characters."),
    employment_type: z.enum([
      "Full-time",
      "Part-time",
      "Contract",
      "Internship",
    ]),
    summary: z
      .string()
      .trim()
      .min(10, "Write a slightly longer summary.")
      .max(500, "Keep the summary under 500 characters."),
    description: z
      .string()
      .trim()
      .min(20, "Write a slightly longer description.")
      .max(20_000, "Keep the description under 20,000 characters."),
    responsibilities: z
      .array(bulletSchema)
      .min(1, "Add at least one responsibility.")
      .max(30, "Keep this to 30 responsibilities or fewer."),
    requirements: z
      .array(bulletSchema)
      .min(1, "Add at least one requirement.")
      .max(30, "Keep this to 30 requirements or fewer."),
    closing_date: z.string().min(1, "Choose a closing date."),
    status: z.enum(["Draft", "Open", "Closed"]),
  })
  .superRefine((values, context) => {
    if (
      values.status === "Open" &&
      values.closing_date &&
      values.closing_date < todayIso()
    ) {
      context.addIssue({
        code: "custom",
        path: ["closing_date"],
        message: "An open role needs a closing date of today or later.",
      });
    }
  });

type JobFormValues = z.infer<typeof jobFormSchema>;

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function inDays(days: number) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

function defaultValues(job?: AdminJobDetail): JobFormValues {
  if (!job) {
    return {
      title: "",
      location: "",
      employment_type: "Full-time",
      summary: "",
      description: "",
      responsibilities: [{ value: "" }],
      requirements: [{ value: "" }],
      closing_date: inDays(30),
      status: "Draft",
    };
  }

  return {
    title: job.title,
    location: job.location,
    employment_type: job.employment_type,
    summary: job.summary,
    description: job.description,
    responsibilities: job.responsibilities.map((value) => ({ value })),
    requirements: job.requirements.map((value) => ({ value })),
    closing_date: job.closing_date,
    status: job.status,
  };
}

const statusHints: Record<JobStatus, string> = {
  Draft: "Only staff can see this role.",
  Open: "Visible on the public job board and accepting applications.",
  Closed: "Hidden from the public board; existing applications stay available.",
};

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 text-xs font-medium text-destructive" role="alert">
      {message}
    </p>
  );
}

function BulletEditor({
  name,
  label,
  hint,
  placeholder,
  form,
}: {
  name: "responsibilities" | "requirements";
  label: string;
  hint: string;
  placeholder: string;
  form: UseFormReturn<JobFormValues>;
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name,
  });
  const error = form.formState.errors[name] as
    | FieldErrors<JobFormValues>[typeof name]
    | undefined;

  return (
    <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold tracking-tight">{label}</h2>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {hint}
          </p>
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ value: "" })}
          disabled={fields.length >= 30}
        >
          <Plus aria-hidden="true" />
          Add
        </Button>
      </div>

      <div className="mt-4 space-y-2">
        {fields.map((field, index) => (
          <div key={field.id} className="flex items-start gap-2">
            <span
              aria-hidden="true"
              className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary"
            />
            <div className="min-w-0 flex-1">
              <input
                {...form.register(`${name}.${index}.value`)}
                placeholder={placeholder}
                aria-label={`${label} ${index + 1}`}
                aria-invalid={Boolean(
                  form.formState.errors[name]?.[index]?.value,
                )}
                className={inputClass}
              />
              <FieldError
                message={form.formState.errors[name]?.[index]?.value?.message}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(index)}
              disabled={fields.length === 1}
              aria-label={`Remove ${label.toLowerCase()} ${index + 1}`}
              className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive disabled:pointer-events-none disabled:opacity-30"
            >
              <Trash2 aria-hidden="true" className="size-4" />
            </button>
          </div>
        ))}
      </div>

      {typeof error?.message === "string" ? (
        <FieldError message={error.message} />
      ) : null}
    </section>
  );
}

export function JobForm({ job }: { job?: AdminJobDetail }) {
  const router = useRouter();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob(job?.id ?? 0);
  const closeJob = useCloseJob();
  const [closeOpen, setCloseOpen] = useState(false);
  const [status, setStatus] = useState<JobStatus>(job?.status ?? "Draft");
  const [closingDate, setClosingDate] = useState(
    job?.closing_date ?? inDays(30),
  );

  const form = useForm<JobFormValues>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: defaultValues(job),
    mode: "onBlur",
  });
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = form;

  const statusOptions: JobStatus[] = job
    ? JOB_STATUS_TRANSITIONS[job.status]
    : ["Draft", "Open"];
  const statusField = register("status");
  const closingDateField = register("closing_date");

  const isPending = job ? updateJob.isPending : createJob.isPending;  function toPayload(values: JobFormValues): JobCreateInput {
    return {
      title: values.title.trim(),
      location: values.location.trim(),
      employment_type: values.employment_type,
      summary: values.summary.trim(),
      description: values.description.trim(),
      responsibilities: values.responsibilities.map((item) =>
        item.value.trim(),
      ),
      requirements: values.requirements.map((item) => item.value.trim()),
      closing_date: values.closing_date,
      status: values.status === "Closed" ? "Open" : values.status,
    };
  }

  function onSubmit(values: JobFormValues) {
    if (job) {
      const payload = toPayload(values);
      updateJob.mutate(
        { ...payload, status: values.status },
        {
          onSuccess: () => {
            reset(values);
            router.refresh();
          },
        },
      );
      return;
    }

    createJob.mutate(toPayload(values), {
      onSuccess: (created) => {
        router.replace(`/admin/jobs/${created.id}/edit?created=1`);
      },
    });
  }

  function confirmClose() {
    if (!job) return;

    closeJob.mutate(job.id, {
      onSuccess: () => {
        setCloseOpen(false);
        form.setValue("status", "Closed");
        setStatus("Closed");
        router.refresh();
      },
    });
  }

  return (
    <div className="space-y-5">
      <div>
        <Link
          href="/admin/jobs"
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft aria-hidden="true" className="size-3.5" />
          All jobs
        </Link>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {job ? job.title : "Create a role"}
              </h1>
              {job ? <JobStatusBadge status={job.status} /> : null}
            </div>
            <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {job
                ? "Update the listing, control its lifecycle and keep the public job board in sync."
                : "Add the details candidates will see. Save it as a draft until it is ready to publish."}
            </p>
          </div>
          {job ? (
            <Link
              href={`/admin/jobs/${job.id}/applications`}
              className="inline-flex h-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
            >
              View applications
            </Link>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-semibold tracking-tight">Role basics</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              The information shown in the job card and listing header.
            </p>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="job-title" className="mb-1.5 block text-sm font-medium">
                Job title
              </label>
              <input
                id="job-title"
                {...register("title")}
                placeholder="Senior Product Designer"
                aria-invalid={Boolean(errors.title)}
                className={inputClass}
              />
              <FieldError message={errors.title?.message} />
            </div>

            <div>
              <label
                htmlFor="job-location"
                className="mb-1.5 block text-sm font-medium"
              >
                Location
              </label>
              <input
                id="job-location"
                {...register("location")}
                placeholder="Kigali, Rwanda · Hybrid"
                aria-invalid={Boolean(errors.location)}
                className={inputClass}
              />
              <FieldError message={errors.location?.message} />
            </div>

            <div>
              <label
                htmlFor="job-employment-type"
                className="mb-1.5 block text-sm font-medium"
              >
                Employment type
              </label>
              <select
                id="job-employment-type"
                {...register("employment_type")}
                className={inputClass}
              >
                {employmentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="job-closing-date"
                className="mb-1.5 block text-sm font-medium"
              >
                Closing date
              </label>
              <input
                id="job-closing-date"
                type="date"
                {...closingDateField}
                onChange={(event) => {
                  closingDateField.onChange(event);
                  setClosingDate(event.target.value);
                }}
                min={status === "Open" ? todayIso() : undefined}
                aria-invalid={Boolean(errors.closing_date)}
                className={inputClass}
              />
              <FieldError message={errors.closing_date?.message} />
              {status === "Open" && closingDate && closingDate < todayIso() ? (
                <p className="mt-1.5 text-xs text-destructive">
                  An open role cannot close in the past.
                </p>
              ) : null}
            </div>

            <div>
              <label
                htmlFor="job-status"
                className="mb-1.5 block text-sm font-medium"
              >
                Status
              </label>
              <select
                id="job-status"
                {...statusField}
                onChange={(event) => {
                  statusField.onChange(event);
                  setStatus(event.target.value as JobStatus);
                }}
                className={inputClass}
              >
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                {statusHints[status]}
              </p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <div>
            <h2 className="font-semibold tracking-tight">Listing copy</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              A short pitch for the job card and the full description for the
              details page.
            </p>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <label
                htmlFor="job-summary"
                className="mb-1.5 block text-sm font-medium"
              >
                Summary
              </label>
              <textarea
                id="job-summary"
                rows={3}
                {...register("summary")}
                placeholder="A one or two sentence overview of the role."
                aria-invalid={Boolean(errors.summary)}
                className={textareaClass}
              />
              <FieldError message={errors.summary?.message} />
            </div>

            <div>
              <label
                htmlFor="job-description"
                className="mb-1.5 block text-sm font-medium"
              >
                Description
              </label>
              <textarea
                id="job-description"
                rows={8}
                {...register("description")}
                placeholder="Describe the team, the mission and what the person will own…"
                aria-invalid={Boolean(errors.description)}
                className={textareaClass}
              />
              <FieldError message={errors.description?.message} />
            </div>
          </div>
        </section>

        <div className="grid gap-5 lg:grid-cols-2">
          <BulletEditor
            form={form}
            name="responsibilities"
            label="Responsibilities"
            hint="The outcomes this person will own."
            placeholder="Lead end-to-end product design…"
          />
          <BulletEditor
            form={form}
            name="requirements"
            label="Requirements"
            hint="The experience and skills you are looking for."
            placeholder="5+ years of product design experience…"
          />
        </div>

        <section className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            {job && job.status === "Open" ? (
              <Button
                type="button"
                variant="destructive"
                onClick={() => setCloseOpen(true)}
                disabled={closeJob.isPending}
              >
                {closeJob.isPending ? (
                  <Loader2 aria-hidden="true" className="animate-spin" />
                ) : (
                  <Lock aria-hidden="true" />
                )}
                Close role
              </Button>
            ) : (
              <p className="px-1 text-xs leading-relaxed text-muted-foreground">
                {job
                  ? "Changes go live as soon as the role is saved."
                  : "You can publish now or keep this role as a draft."}
              </p>
            )}
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row">
            <Button type="button" variant="outline" asChild>
              <Link href="/admin/jobs">Cancel</Link>
            </Button>
            <Button
              type="submit"
              disabled={isPending || (Boolean(job) && !isDirty)}
            >
              {isPending ? (
                <>
                  <Loader2 aria-hidden="true" className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <Save aria-hidden="true" />
                  {job ? "Save changes" : "Create role"}
                </>
              )}
            </Button>
          </div>
        </section>
      </form>

      {job ? (
        <ConfirmDialog
          open={closeOpen}
          onOpenChange={(open) => {
            setCloseOpen(open);
            if (!open) closeJob.reset();
          }}
          title={`Close ${job.title}?`}
          description="The role will stop accepting applications immediately. Existing applications and CVs are kept for review, and the role can be reopened later."
          confirmLabel="Close role"
          pendingLabel="Closing…"
          destructive
          isPending={closeJob.isPending}
          error={
            closeJob.error instanceof Error ? closeJob.error.message : null
          }
          onConfirm={confirmClose}
        />
      ) : null}
    </div>
  );
}
