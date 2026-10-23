"use client";

import { create } from "zustand";

export type SubscribeStatus = "idle" | "submitting" | "success" | "error";

interface NewsletterState {
  email: string;
  status: SubscribeStatus;
  message: string | null;
  subscribedEmails: string[];
  setEmail: (email: string) => void;
  subscribe: (email: string) => Promise<void>;
  reset: () => void;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export const useNewsletterStore = create<NewsletterState>((set, get) => ({
  email: "",
  status: "idle",
  message: null,
  subscribedEmails: [],
  setEmail: (email) => set({ email, message: null, status: "idle" }),
  subscribe: async (email) => {
    const value = email.trim().toLowerCase();

    if (!EMAIL_PATTERN.test(value)) {
      set({
        status: "error",
        message: "That email doesn't look right. Please check it and try again.",
      });
      return;
    }

    if (get().subscribedEmails.includes(value)) {
      set({ status: "success", message: "You're already on the list." });
      return;
    }

    set({ status: "submitting", message: null });
    await wait(700);

    set((state) => ({
      status: "success",
      email: value,
      message: "You're on the list. The next roundup lands on Friday.",
      subscribedEmails: [...state.subscribedEmails, value],
    }));
  },
  reset: () => set({ email: "", status: "idle", message: null }),
}));
