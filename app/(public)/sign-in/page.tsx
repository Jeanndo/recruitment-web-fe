import type { Metadata } from "next";

import { SignInScreen } from "@/components/auth/sign-in-screen";

export const metadata: Metadata = {
  title: "Sign in",
  description:
    "Sign in to your BrightCore account to manage roles and applications.",
};

export default function SignInPage() {
  return <SignInScreen />;
}
