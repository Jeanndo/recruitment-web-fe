"use client";

import { Suspense, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  LockKeyhole,
} from "lucide-react";

import { Brand } from "@/components/layout/brand";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCurrentUser, useLogin } from "@/hooks/use-admin-auth";

const fieldClass =
  "h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground transition-colors placeholder:text-muted-foreground focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-ring/20 focus-visible:outline-none";

const bullets = [
  "Publish roles and control their lifecycle.",
  "Review applications and leave internal notes.",
  "Download applicant CVs through a protected API.",
];

function safeNext(value: string | null): string {
  if (!value || !value.startsWith("/admin") || value.startsWith("//")) {
    return "/admin";
  }
  return value;
}

function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));
  const currentUser = useCurrentUser();
  const login = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (currentUser.data) {
      router.replace(next);
    }
  }, [currentUser.data, next, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    login.mutate(
      { email: email.trim(), password },
      {
        onSuccess: () => {
          router.replace(next);
          router.refresh();
        },
      },
    );
  }

  if (currentUser.data) {
    return (
      <div className="grid min-h-svh place-items-center bg-muted/30">
        <Loader2
          aria-label="Redirecting"
          className="size-5 animate-spin text-primary"
        />
      </div>
    );
  }

  return (
    <div className="grid min-h-svh lg:grid-cols-[1.05fr_1fr]">
      <section className="relative hidden overflow-hidden bg-sidebar p-10 text-sidebar-foreground lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div
          aria-hidden="true"
          className="absolute -top-32 -right-24 size-96 rounded-full bg-primary/20 blur-3xl"
        />
        <div className="relative max-w-md">
          <h1 className="mt-5 text-4xl leading-tight font-semibold tracking-tight text-balance">
            Review great candidates. Move hiring forward.
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-sidebar-foreground/70">
            Publish roles, follow every application and keep your review notes
            in one calm, focused workspace.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-sidebar-foreground/80">
            {bullets.map((bullet) => (
              <li key={bullet} className="flex items-center gap-3">
                <CheckCircle2
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary"
                />
                {bullet}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-xs text-sidebar-foreground/50">
          BrightCore Recruitment · Staff access
        </p>
      </section>

      <section className="relative flex flex-col bg-background">
        

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-sm">
            <span className="grid size-11 place-items-center rounded-xl bg-accent text-primary">
              <LockKeyhole aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl">
              Sign in
            </h2>

            <form onSubmit={handleSubmit} className="mt-7 space-y-4">
              <div>
                <label
                  htmlFor="sign-in-email"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Email
                </label>
                <input
                  id="sign-in-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="you@brightcore.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={fieldClass}
                />
              </div>

              <div>
                <label
                  htmlFor="sign-in-password"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Password
                </label>
                <input
                  id="sign-in-password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="Your password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className={fieldClass}
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={login.isPending}
                className="h-11 w-full"
              >
                {login.isPending ? (
                  <>
                    <Loader2 aria-hidden="true" className="animate-spin" />
                    Signing in…
                  </>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs leading-relaxed text-muted-foreground">
              Candidate accounts are coming soon. This sign-in is for BrightCore
              staff.
            </p>

            <p className="mt-4 text-center text-sm text-muted-foreground">
              Looking for a role?{" "}
              <Link
                href="/"
                className="font-medium text-primary underline-offset-4 hover:underline"
              >
                Browse open roles
              </Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

/** The single sign-in screen for the whole platform. */
export function SignInScreen() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-svh place-items-center bg-background">
          <Loader2
            aria-label="Loading sign in"
            className="size-5 animate-spin text-primary"
          />
        </div>
      }
    >
      <SignInForm />
    </Suspense>
  );
}
