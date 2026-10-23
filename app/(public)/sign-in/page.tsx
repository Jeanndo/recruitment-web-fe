import type { Metadata } from "next";

import { AuthCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to BrightCore to save roles, track applications and manage job alerts.",
};

export default function SignInPage() {
  return <AuthCard mode="sign-in" />;
}
