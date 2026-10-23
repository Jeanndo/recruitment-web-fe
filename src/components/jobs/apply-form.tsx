"use client";

import { useState, type FormEvent } from "react";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

import { submitApplication } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ApplyFormProps {
  jobId: number;
  jobTitle: string;
  acceptingApplications: boolean;
}

/**
 * The application form.
 */
export function ApplyForm({
  jobId,
  jobTitle,
  acceptingApplications,
}: ApplyFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!acceptingApplications) {
      setError("This role is no longer accepting applications.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const fullName = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const phoneNumber = String(formData.get("phone") ?? "").trim();
    const coverNote = String(formData.get("note") ?? "").trim();

    if (!fullName || !email || !phoneNumber) {
      setError("Please fill in your full name, email and phone number.");
      return;
    }

    if (!cvFile) {
      setError("Please attach your CV as a PDF.");
      return;
    }

    if (coverNote.length < 10) {
      setError("Please add a short note of at least 10 characters.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitApplication({
        jobId,
        fullName,
        email,
        phoneNumber,
        coverNote,
        cv: cvFile,
      });
      setSubmitted(true);
    } catch (submissionError) {
      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "We couldn't submit your application right now.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!acceptingApplications) {
    return (
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-xl font-semibold tracking-tight">
          Applications closed
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          This role is no longer accepting applications. Existing applications
          are still under review.
        </p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        aria-live="polite"
        className="rounded-2xl border border-primary/20 bg-accent p-6"
      >
        <CheckCircle2 aria-hidden="true" className="size-6 text-primary" />
        <h3 className="mt-3 text-xl font-semibold tracking-tight">
          Application received
        </h3>
        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
          Thank you for applying to {jobTitle}. A member of the BrightCore team
          will review your application and get back to you.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setError(null);
            setCvFile(null);
            setFormKey((key) => key + 1);
          }}
          className="mt-4 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Submit another application
        </button>
      </div>
    );
  }

  const fieldClass =
    "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none";

  return (
    <form
      key={formKey}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
      className="rounded-2xl border border-border bg-card p-5 sm:p-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="apply-name"
            className="mb-1.5 block text-sm font-medium"
          >
            Full name
          </label>
          <input
            id="apply-name"
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={150}
            autoComplete="name"
            placeholder="Jane Uwase"
            className={fieldClass}
          />
        </div>

        <div>
          <label
            htmlFor="apply-email"
            className="mb-1.5 block text-sm font-medium"
          >
            Email
          </label>
          <input
            id="apply-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="apply-phone"
          className="mb-1.5 block text-sm font-medium"
        >
          Phone number
        </label>
        <input
          id="apply-phone"
          name="phone"
          type="tel"
          required
          minLength={7}
          maxLength={20}
          autoComplete="tel"
          placeholder="+250 7XX XXX XXX"
          className={fieldClass}
        />
      </div>

      <div className="mt-4">
        <label htmlFor="apply-cv" className="mb-1.5 block text-sm font-medium">
          CV
        </label>
        <input
          id="apply-cv"
          name="cv"
          type="file"
          accept=".pdf,application/pdf"
          required
          onChange={(event) => setCvFile(event.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          PDF only, up to 5 MB.
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor="apply-note" className="mb-1.5 block text-sm font-medium">
          A short note
        </label>
        <textarea
          id="apply-note"
          name="note"
          rows={4}
          required
          minLength={10}
          maxLength={2000}
          placeholder="Tell us why this role fits you — a few sentences is plenty."
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none"
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/10 px-3 py-2 text-sm text-destructive"
        >
          <AlertCircle aria-hidden="true" className="mt-0.5 size-4 shrink-0" />
          <p>{error}</p>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className={cn(
          "mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 disabled:opacity-60",
        )}
      >
        {isSubmitting ? (
          <>
            <Loader2 aria-hidden="true" className="size-4 animate-spin" />
            Submitting…
          </>
        ) : (
          "Submit application"
        )}
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Your details are sent securely to the BrightCore team.
      </p>
    </form>
  );
}
