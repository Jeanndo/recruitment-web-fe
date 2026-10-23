"use client";

import { useState } from "react";
import {
  AlertCircle,
  Briefcase,
  CalendarDays,
  Check,
  Download,
  FileText,
  Loader2,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";

import { ApplicationStatusBadge } from "@/components/admin/status-badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  useApplicationDetail,
  useDownloadCv,
  useUpdateApplicationStatus,
} from "@/hooks/use-application-review";
import { formatDate, formatDateTime } from "@/lib/format";
import type {
  AdminApplicationDetail,
  ApplicationStatus,
} from "@/types/admin";

function fileSize(bytes: number) {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

function ReviewSkeleton() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="space-y-3 border-b border-border p-5">
        <div className="h-5 w-24 animate-pulse rounded-full bg-muted" />
        <div className="h-7 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-56 animate-pulse rounded bg-muted" />
      </div>
      <div className="flex-1 space-y-4 p-5">
        <div className="h-24 animate-pulse rounded-xl bg-muted/60" />
        <div className="h-20 animate-pulse rounded-xl bg-muted/60" />
        <div className="h-40 animate-pulse rounded-xl bg-muted/60" />
      </div>
    </div>
  );
}

function ApplicationReview({
  application,
  onNotify,
  onClose,
}: {
  application: AdminApplicationDetail;
  onNotify?: (message: string) => void;
  onClose: () => void;
}) {
  const updateStatus = useUpdateApplicationStatus();
  const download = useDownloadCv();
  const [note, setNote] = useState(application.admin_note ?? "");
  const [feedback, setFeedback] = useState<string | null>(null);

  const noteChanged = note !== (application.admin_note ?? "");
  const isDownloading = download.isPending && download.variables?.id === application.id;

  function applyStatus(status: ApplicationStatus) {
    updateStatus.mutate(
      {
        id: application.id,
        status,
        adminNote: note.trim() ? note.trim() : null,
      },
      {
        onSuccess: (result) => {
          const changed = application.status !== result.status;
          const message = changed
            ? `${application.full_name} was ${result.status.toLowerCase()}.`
            : "Internal note saved.";
          setFeedback(message);
          onNotify?.(message);
        },
        onError: (error) => {
          setFeedback(
            error instanceof Error ? error.message : "The review could not be saved.",
          );
        },
      },
    );
  }

  function saveNote() {
    updateStatus.mutate(
      {
        id: application.id,
        status: application.status,
        adminNote: note.trim() ? note.trim() : null,
      },
      {
        onSuccess: () => {
          setFeedback("Internal note saved.");
          onNotify?.("Internal note saved.");
        },
        onError: (error) => {
          setFeedback(
            error instanceof Error ? error.message : "The note could not be saved.",
          );
        },
      },
    );
  }

  function handleDownload() {
    download.mutate(application, {
      onSuccess: (filename) => {
        const message = `Downloaded ${filename}.`;
        setFeedback(message);
        onNotify?.(message);
      },
      onError: (error) => {
        setFeedback(
          error instanceof Error ? error.message : "The CV could not be downloaded.",
        );
      },
    });
  }

  return (
    <>
      <SheetHeader className="border-b border-border p-5 pr-14">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <ApplicationStatusBadge status={application.status} />
          <span>Applied {formatDateTime(application.created_at)}</span>
        </div>
        <SheetTitle className="mt-1 text-xl">{application.full_name}</SheetTitle>
        <SheetDescription>{application.email}</SheetDescription>
      </SheetHeader>

      <div className="flex-1 space-y-6 overflow-y-auto p-5">
        <section>
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Contact
          </h3>
          <ul className="mt-3 space-y-2.5 text-sm">
            <li>
              <a
                href={`mailto:${application.email}`}
                className="inline-flex items-center gap-2.5 hover:text-primary"
              >
                <Mail
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                <span className="break-all">{application.email}</span>
              </a>
            </li>
            <li>
              <a
                href={`tel:${application.phone_number.replace(/\s+/g, "")}`}
                className="inline-flex items-center gap-2.5 hover:text-primary"
              >
                <Phone
                  aria-hidden="true"
                  className="size-4 shrink-0 text-muted-foreground"
                />
                {application.phone_number}
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Role
          </h3>
          <div className="mt-3 rounded-xl border border-border bg-muted/40 p-4">
            <p className="flex items-start gap-2 font-medium">
              <Briefcase
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              />
              {application.job.title}
            </p>
            <div className="mt-2 space-y-1 pl-6 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <MapPin aria-hidden="true" className="size-3.5" />
                {application.job.location}
              </p>
              <p className="flex items-center gap-1.5">
                <CalendarDays aria-hidden="true" className="size-3.5" />
                Closes {formatDate(application.job.closing_date)}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            CV
          </h3>
          {application.cv ? (
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-border bg-card p-3">
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-lg bg-accent text-primary"
              >
                <FileText className="size-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">
                  {application.cv.filename}
                </p>
                <p className="text-xs text-muted-foreground">
                  {application.cv.content_type.replace("application/", "").toUpperCase()} ·{" "}
                  {fileSize(application.cv.size_bytes)}
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleDownload}
                disabled={isDownloading}
                aria-label={`Download CV for ${application.full_name}`}
                className="shrink-0"
              >
                {isDownloading ? (
                  <Loader2 aria-hidden="true" className="animate-spin" />
                ) : (
                  <Download aria-hidden="true" />
                )}
                <span className="hidden sm:inline">
                  {isDownloading ? "Preparing…" : "Download"}
                </span>
              </Button>
            </div>
          ) : (
            <p className="mt-3 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
              No CV was attached to this application.
            </p>
          )}
        </section>

        <section>
          <h3 className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Cover note
          </h3>
          <p className="mt-3 text-sm leading-relaxed whitespace-pre-line text-muted-foreground">
            {application.cover_note}
          </p>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="admin-note"
              className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase"
            >
              Internal note
            </label>
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={saveNote}
              disabled={!noteChanged || updateStatus.isPending}
            >
              Save note
            </Button>
          </div>
          <textarea
            id="admin-note"
            rows={4}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Notes for the hiring team…"
            maxLength={2_000}
            className="mt-2 w-full resize-y rounded-lg border border-border bg-background px-3 py-2 text-sm transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Only staff can see this note.
          </p>
        </section>
      </div>

      <SheetFooter className="border-t border-border bg-card p-4">
        <p
          aria-live="polite"
          className="min-h-4 text-xs font-medium text-muted-foreground"
        >
          {updateStatus.isPending ? "Saving…" : feedback}
        </p>
        <div className="flex gap-2">
          <Button
            type="button"
            onClick={() => applyStatus("Accepted")}
            disabled={
              application.status === "Accepted" || updateStatus.isPending
            }
            className="h-10 flex-1"
          >
            {updateStatus.isPending &&
            updateStatus.variables?.status === "Accepted" ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : (
              <Check aria-hidden="true" />
            )}
            {application.status === "Accepted" ? "Accepted" : "Accept"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => applyStatus("Rejected")}
            disabled={
              application.status === "Rejected" || updateStatus.isPending
            }
            className="h-10 flex-1 border-rose-500/30 text-rose-700 hover:bg-rose-500/10 dark:text-rose-300"
          >
            {updateStatus.isPending &&
            updateStatus.variables?.status === "Rejected" ? (
              <Loader2 aria-hidden="true" className="animate-spin" />
            ) : (
              <X aria-hidden="true" />
            )}
            {application.status === "Rejected" ? "Rejected" : "Reject"}
          </Button>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-center text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Close review
        </button>
      </SheetFooter>
    </>
  );
}

export function ApplicationDetailSheet({
  applicationId,
  open,
  onOpenChange,
  onNotify,
}: {
  applicationId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNotify?: (message: string) => void;
}) {
  const application = useApplicationDetail(applicationId);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full gap-0 overflow-hidden p-0 sm:max-w-lg"
      >
        {application.isLoading ? (
          <>
            <SheetTitle className="sr-only">
              Loading application review
            </SheetTitle>
            <SheetDescription className="sr-only">
              Fetching the candidate&apos;s application details.
            </SheetDescription>
            <ReviewSkeleton />
          </>
        ) : application.isError || !application.data ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 py-16 text-center">
            <AlertCircle
              aria-hidden="true"
              className="size-8 text-destructive"
            />
            <SheetTitle className="mt-3 text-lg">Could not load review</SheetTitle>
            <SheetDescription className="mt-1 max-w-xs">
              {application.error instanceof Error
                ? application.error.message
                : "The application could not be loaded."}
            </SheetDescription>
            <div className="mt-5 flex gap-2">
              <Button
                type="button"
                onClick={() => void application.refetch()}
                disabled={application.isFetching}
              >
                {application.isFetching ? (
                  <Loader2 aria-hidden="true" className="animate-spin" />
                ) : null}
                Try again
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <ApplicationReview
            key={application.data.id}
            application={application.data}
            onNotify={onNotify}
            onClose={() => onOpenChange(false)}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}
