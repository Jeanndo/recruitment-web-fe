import type { Metadata } from "next";

import { SignUpCard } from "@/components/auth/auth-card";

export const metadata: Metadata = {
  title: "Sign up",
  description:
    "Create a BrightCore account to save roles, track applications and get job alerts.",
};

export default function SignUpPage() {
  return <SignUpCard />;
}
