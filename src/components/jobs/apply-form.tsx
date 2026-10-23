"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";

/**
 * The Application form
 */
export function ApplyForm({ jobTitle }: { jobTitle: string }) {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
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
          This is a demo, so nothing was sent. In the real flow you would hear
          from a person about your application for {jobTitle} within a week.
        </p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 text-sm font-medium text-primary underline underline-offset-4 hover:text-primary/80"
        >
          Start over
        </button>
      </div>
    );
  }

  const fieldClass =
    "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none";

  return (
    <form
      onSubmit={handleSubmit}
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
          htmlFor="apply-portfolio"
          className="mb-1.5 block text-sm font-medium"
        >
          Portfolio or LinkedIn{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <input
          id="apply-portfolio"
          name="portfolio"
          type="url"
          placeholder="https://"
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
          accept=".pdf,.doc,.docx"
          className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          PDF or Word document, 5 MB maximum.
        </p>
      </div>

      <div className="mt-4">
        <label htmlFor="apply-note" className="mb-1.5 block text-sm font-medium">
          A short note{" "}
          <span className="font-normal text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="apply-note"
          name="note"
          rows={4}
          placeholder="Anything you'd like us to know?"
          className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none"
        />
      </div>

      <button
        type="submit"
        className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
      >
        Submit application
      </button>

      <p className="mt-3 text-center text-xs text-muted-foreground">
        Demo form — nothing is sent or stored yet.
      </p>
    </form>
  );
}
