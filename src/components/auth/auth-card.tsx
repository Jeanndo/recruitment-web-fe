"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, LockKeyhole } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Badge } from "@/components/ui/badge";

type AuthMode = "sign-in" | "sign-up";

const copy: Record<
  AuthMode,
  {
    title: string;
    description: string;
    submit: string;
    alternateText: string;
    alternateHref: string;
    alternateLabel: string;
  }
> = {
  "sign-in": {
    title: "Welcome back",
    description:
      "Sign in to save roles, track your applications and manage job alerts.",
    submit: "Sign in",
    alternateText: "New to BrightCore?",
    alternateHref: "/sign-up",
    alternateLabel: "Create an account",
  },
  "sign-up": {
    title: "Create your account",
    description:
      "Save roles you like, keep track of applications and get jobs in your inbox.",
    submit: "Create account",
    alternateText: "Already have an account?",
    alternateHref: "/sign-in",
    alternateLabel: "Sign in",
  },
};

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none";

/**
 * Shared sign-in and sign-up card.
 */
export function AuthCard({ mode }: { mode: AuthMode }) {
  const content = copy[mode];
  const isSignUp = mode === "sign-up";
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="bg-gradient-to-b from-accent via-background to-background">
      <Container className="flex justify-center py-14 sm:py-20">
        <div className="w-full max-w-md">
          <Link
            href="/#open-roles"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Back to open roles
          </Link>

          <div className="mt-5 rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <span className="grid size-10 place-items-center rounded-xl bg-accent text-primary">
                <LockKeyhole aria-hidden="true" className="size-5" />
              </span>
              <Badge className="bg-accent text-primary">Coming soon</Badge>
            </div>

            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
              {content.title}
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {content.description}
            </p>

            <form
              onSubmit={handleSubmit}
              aria-describedby="auth-note"
              className="mt-6"
            >
              <div className="space-y-4">
                {isSignUp ? (
                  <div>
                    <label
                      htmlFor="auth-name"
                      className="mb-1.5 block text-sm font-medium"
                    >
                      Full name
                    </label>
                    <input
                      id="auth-name"
                      name="name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="Jane Uwase"
                      className={fieldClass}
                    />
                  </div>
                ) : null}

                <div>
                  <label
                    htmlFor="auth-email"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Email
                  </label>
                  <input
                    id="auth-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={fieldClass}
                  />
                </div>

                <div>
                  <label
                    htmlFor="auth-password"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Password
                  </label>
                  <input
                    id="auth-password"
                    name="password"
                    type="password"
                    required
                    minLength={8}
                    autoComplete={isSignUp ? "new-password" : "current-password"}
                    placeholder="At least 8 characters"
                    className={fieldClass}
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30"
                >
                  {content.submit}
                </button>
              </div>

              <p
                id="auth-note"
                aria-live="polite"
                className="mt-3 text-center text-xs leading-relaxed text-muted-foreground"
              >
                {submitted
                  ? "Authentication isn't connected yet — we're still finishing it. Check back soon."
                  : "Accounts are coming soon. The form above is a preview."}
              </p>
            </form>

            <div className="mt-6 border-t border-border pt-5 text-center text-sm text-muted-foreground">
              {content.alternateText}{" "}
              <Link
                href={content.alternateHref}
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                {content.alternateLabel}
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
