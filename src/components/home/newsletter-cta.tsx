"use client";

import type { FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import { Container } from "@/components/layout/container";
import { useNewsletterStore } from "@/stores/newsletter-store";

export function NewsletterCta() {
  const { email, status, message, setEmail, subscribe, reset } =
    useNewsletterStore(
      useShallow((state) => ({
        email: state.email,
        status: state.status,
        message: state.message,
        setEmail: state.setEmail,
        subscribe: state.subscribe,
        reset: state.reset,
      })),
    );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await subscribe(email);
  }

  return (
    <section id="newsletter" className="scroll-mt-20 bg-background">
      <Container className="py-14 sm:py-20">
        <div className="rounded-3xl bg-primary px-6 py-10 text-center text-primary-foreground sm:px-12 sm:py-14">
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.16em] text-blue-100 uppercase">
              Job alerts
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              New roles, straight to your inbox.
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-blue-100 sm:text-base">
              One short email a week with the best new openings. No noise, no
              recruiter spam — just roles worth a look.
            </p>
          </div>

          <div className="mx-auto mt-7 max-w-lg">
            {status === "success" ? (
              <div
                aria-live="polite"
                className="rounded-xl bg-white/10 p-5 text-left ring-1 ring-white/20"
              >
                <div className="flex items-start gap-3">
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 size-5 shrink-0 text-white"
                  />
                  <div>
                    <p className="font-medium text-white">
                      You&apos;re subscribed.
                    </p>
                    <p className="mt-1 text-sm text-blue-100">{message}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-4 text-sm font-medium text-white underline underline-offset-4 hover:text-blue-100"
                >
                  Use a different email
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <label htmlFor="newsletter-email" className="sr-only">
                  Email address
                </label>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="newsletter-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-white/20 bg-white px-4 text-base text-neutral-900 transition-colors placeholder:text-neutral-500 focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="inline-flex h-12 w-full shrink-0 items-center justify-center rounded-xl bg-neutral-950 px-6 text-sm font-medium text-white transition-colors hover:bg-neutral-800 focus-visible:ring-3 focus-visible:ring-white/40 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-70 sm:w-auto"
                  >
                    {status === "submitting" ? "Subscribing…" : "Subscribe"}
                  </button>
                </div>

                <p
                  aria-live="polite"
                  className="mt-3 min-h-5 text-xs text-blue-100"
                >
                  {status === "error" ? (
                    <span className="font-medium text-white">{message}</span>
                  ) : (
                    "No spam. Unsubscribe in one click."
                  )}
                </p>
              </form>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
